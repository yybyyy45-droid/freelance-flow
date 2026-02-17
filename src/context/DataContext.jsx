import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const DataContext = createContext(null)

// ── Helpers: camelCase ↔ snake_case ──────────────────
function toSnake(obj) {
    const map = {
        clientId: 'client_id', projectId: 'project_id',
        invoiceNumber: 'invoice_number', issueDate: 'issue_date',
        dueDate: 'due_date', paidDate: 'paid_date',
        createdAt: 'created_at', updatedAt: 'updated_at',
        userId: 'user_id', avatarUrl: 'avatar_url',
        startDate: 'start_date'
    }
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
        if (k === 'id' || k === 'items') continue          // skip client-gen id & nested items
        out[map[k] || k] = v
    }
    return out
}

function toCamel(obj) {
    const map = {
        client_id: 'clientId', project_id: 'projectId',
        invoice_number: 'invoiceNumber', issue_date: 'issueDate',
        due_date: 'dueDate', paid_date: 'paidDate',
        created_at: 'createdAt', updated_at: 'updatedAt',
        user_id: 'userId', avatar_url: 'avatarUrl',
        start_date: 'startDate'
    }
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
        out[map[k] || k] = v
    }
    return out
}

export function DataProvider({ children }) {
    const { user } = useAuth()
    const [clients, setClients] = useState([])
    const [projects, setProjects] = useState([])
    const [invoices, setInvoices] = useState([])
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)

    // ── Load data when user changes ──────────────────
    const fetchAll = useCallback(async () => {
        if (!user) { setLoading(false); return }
        setLoading(true)
        const [cRes, pRes, iRes, aRes] = await Promise.all([
            supabase.from('clients').select('*').order('created_at', { ascending: false }),
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('invoices').select('*, invoice_items(*)').order('created_at', { ascending: false }),
            supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20)
        ])

        setClients((cRes.data || []).map(toCamel))
        setProjects((pRes.data || []).map(toCamel))

        // Merge invoice_items into invoice.items for backward compat
        setInvoices((iRes.data || []).map(inv => {
            const items = (inv.invoice_items || []).map(it => ({
                id: it.id,
                description: it.description,
                quantity: Number(it.quantity),
                rate: Number(it.rate),
                amount: Number(it.amount)
            }))
            const base = toCamel(inv)
            delete base.invoice_items
            return { ...base, items, subtotal: Number(inv.subtotal), tax: Number(inv.tax), total: Number(inv.total) }
        }))

        setActivity((aRes.data || []).map(a => ({
            id: a.id,
            type: a.type,
            message: a.message,
            amount: a.amount ? Number(a.amount) : null,
            date: a.created_at?.slice(0, 10),
            icon: a.type === 'payment' ? '💰' : a.type === 'invoice' ? '📄' : a.type === 'project' ? '📁' : a.type === 'client' ? '👤' : '🗑️'
        })))
        setLoading(false)
    }, [user])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    const refreshData = useCallback(() => fetchAll(), [fetchAll])

    // ── Activity helper ──────────────────
    const logActivity = useCallback(async (type, message, amount) => {
        if (!user) return
        const { data } = await supabase.from('activity_logs').insert({
            user_id: user.id, type, message, amount: amount || 0
        }).select().single()
        if (data) {
            const a = {
                id: data.id, type, message, amount, date: data.created_at?.slice(0, 10),
                icon: type === 'payment' ? '💰' : type === 'invoice' ? '📄' : type === 'project' ? '📁' : type === 'client' ? '👤' : '🗑️'
            }
            setActivity(prev => [a, ...prev].slice(0, 20))
        }
    }, [user])

    // ── Clients CRUD ──────────────────
    const addClient = useCallback(async (data) => {
        const row = { ...toSnake(data), user_id: user.id }
        const { data: inserted, error } = await supabase.from('clients').insert(row).select().single()
        if (error) { console.error(error); return null }
        const c = toCamel(inserted)
        setClients(prev => [c, ...prev])
        logActivity('client', `New client "${c.name}" added`, null)
        return c
    }, [user, logActivity])

    const updateClient = useCallback(async (id, data) => {
        const row = toSnake(data)
        row.updated_at = new Date().toISOString()
        const { error } = await supabase.from('clients').update(row).eq('id', id)
        if (error) { console.error(error); return }
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    }, [])

    const deleteClient = useCallback(async (id) => {
        const client = clients.find(x => x.id === id)
        const { error } = await supabase.from('clients').delete().eq('id', id)
        if (error) { console.error(error); return }
        setClients(prev => prev.filter(x => x.id !== id))
        if (client) logActivity('client', `Client "${client.name}" removed`, null)
    }, [clients, logActivity])

    // ── Projects CRUD ──────────────────
    const addProject = useCallback(async (data) => {
        const row = { ...toSnake(data), user_id: user.id, spent: data.spent || 0 }
        const { data: inserted, error } = await supabase.from('projects').insert(row).select().single()
        if (error) { console.error(error); return null }
        const p = toCamel(inserted)
        setProjects(prev => [p, ...prev])
        logActivity('project', `New project "${p.name}" created`, null)
        return p
    }, [user, logActivity])

    const updateProject = useCallback(async (id, data) => {
        const row = toSnake(data)
        row.updated_at = new Date().toISOString()
        const { error } = await supabase.from('projects').update(row).eq('id', id)
        if (error) { console.error(error); return }
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }, [])

    const deleteProject = useCallback(async (id) => {
        const project = projects.find(x => x.id === id)
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) { console.error(error); return }
        setProjects(prev => prev.filter(x => x.id !== id))
        if (project) logActivity('project', `Project "${project.name}" removed`, null)
    }, [projects, logActivity])

    // ── Invoices CRUD ──────────────────
    const getNextInvoiceNumber = useCallback(() => {
        const nums = invoices.map(i => {
            const m = i.invoiceNumber?.match(/INV-(\d+)/)
            return m ? parseInt(m[1]) : 0
        })
        const next = Math.max(0, ...nums) + 1
        return `INV-${String(next).padStart(3, '0')}`
    }, [invoices])

    const addInvoice = useCallback(async (data) => {
        const invNumber = data.invoiceNumber || getNextInvoiceNumber()
        const row = {
            user_id: user.id,
            client_id: data.clientId || null,
            project_id: data.projectId || null,
            invoice_number: invNumber,
            status: data.status || 'draft',
            issue_date: data.issueDate || new Date().toISOString().slice(0, 10),
            due_date: data.dueDate || null,
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            total: data.total || 0,
            notes: data.notes || ''
        }
        const { data: inserted, error } = await supabase.from('invoices').insert(row).select().single()
        if (error) { console.error(error); return null }

        // Insert line items
        const items = (data.items || []).map(it => ({
            invoice_id: inserted.id,
            description: it.description,
            quantity: it.quantity,
            rate: it.rate
        }))
        let savedItems = []
        if (items.length) {
            const { data: itemData } = await supabase.from('invoice_items').insert(items).select()
            savedItems = (itemData || []).map(it => ({
                id: it.id, description: it.description,
                quantity: Number(it.quantity), rate: Number(it.rate), amount: Number(it.amount)
            }))
        }

        const inv = { ...toCamel(inserted), items: savedItems, invoiceNumber: invNumber }
        setInvoices(prev => [inv, ...prev])
        logActivity('invoice', `Invoice ${invNumber} created`, inv.total)
        return inv
    }, [user, getNextInvoiceNumber, logActivity])

    const updateInvoice = useCallback(async (id, data) => {
        const row = {
            client_id: data.clientId || null,
            project_id: data.projectId || null,
            status: data.status,
            issue_date: data.issueDate,
            due_date: data.dueDate || null,
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            total: data.total || 0,
            notes: data.notes || '',
            updated_at: new Date().toISOString()
        }
        const { error } = await supabase.from('invoices').update(row).eq('id', id)
        if (error) { console.error(error); return }

        // Replace line items: delete old, insert new
        await supabase.from('invoice_items').delete().eq('invoice_id', id)
        const items = (data.items || []).map(it => ({
            invoice_id: id,
            description: it.description,
            quantity: it.quantity,
            rate: it.rate
        }))
        let savedItems = []
        if (items.length) {
            const { data: itemData } = await supabase.from('invoice_items').insert(items).select()
            savedItems = (itemData || []).map(it => ({
                id: it.id, description: it.description,
                quantity: Number(it.quantity), rate: Number(it.rate), amount: Number(it.amount)
            }))
        }

        setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...data, items: savedItems } : i))
    }, [])

    const deleteInvoice = useCallback(async (id) => {
        const inv = invoices.find(x => x.id === id)
        const { error } = await supabase.from('invoices').delete().eq('id', id)
        if (error) { console.error(error); return }
        setInvoices(prev => prev.filter(x => x.id !== id))
        if (inv) logActivity('invoice', `Invoice ${inv.invoiceNumber} deleted`, null)
    }, [invoices, logActivity])

    const markInvoicePaid = useCallback(async (id) => {
        const today = new Date().toISOString().slice(0, 10)
        const { error } = await supabase.from('invoices').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', id)
        if (error) { console.error(error); return }
        setInvoices(prev => prev.map(i => {
            if (i.id !== id) return i
            const updated = { ...i, status: 'paid', paidDate: today }
            logActivity('payment', `Invoice ${i.invoiceNumber} marked as paid`, i.total)
            return updated
        }))
    }, [logActivity])

    const value = {
        clients, projects, invoices, activity, loading, refreshData,
        addClient, updateClient, deleteClient,
        addProject, updateProject, deleteProject,
        addInvoice, updateInvoice, deleteInvoice, markInvoicePaid,
        getNextInvoiceNumber
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
    const ctx = useContext(DataContext)
    if (!ctx) throw new Error('useData must be used within DataProvider')
    return ctx
}
