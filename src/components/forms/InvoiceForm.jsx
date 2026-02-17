import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../utils/helpers'
import styles from './Forms.module.css'

const emptyItem = { description: '', quantity: 1, rate: 0 }

export default function InvoiceForm({ initial, onSubmit, onCancel }) {
    const { clients, projects } = useData()
    const [form, setForm] = useState({
        clientId: initial?.clientId || (clients[0]?.id || ''),
        projectId: initial?.projectId || '',
        status: initial?.status || 'draft',
        issueDate: initial?.issueDate || new Date().toISOString().slice(0, 10),
        dueDate: initial?.dueDate || '',
        tax: initial?.tax || 0,
        notes: initial?.notes || '',
        items: initial?.items?.length ? initial.items : [{ ...emptyItem }]
    })

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const setItem = (idx, field, val) => {
        setForm(prev => {
            const items = [...prev.items]
            items[idx] = { ...items[idx], [field]: val }
            return { ...prev, items }
        })
    }

    const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }))
    const removeItem = (idx) => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))

    const clientProjects = useMemo(() =>
        projects.filter(p => p.clientId === form.clientId), [projects, form.clientId])

    const subtotal = useMemo(() =>
        form.items.reduce((sum, it) => sum + (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0), 0),
        [form.items])

    const taxAmount = parseFloat(form.tax) || 0
    const total = subtotal + taxAmount

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.clientId || form.items.length === 0) return
        onSubmit({
            ...form,
            tax: taxAmount,
            subtotal,
            total,
            items: form.items.map(it => ({
                description: it.description,
                quantity: parseFloat(it.quantity) || 0,
                rate: parseFloat(it.rate) || 0
            }))
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Client *</label>
                    <select value={form.clientId} onChange={e => { set('clientId', e.target.value); set('projectId', '') }} required>
                        <option value="">Select client...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Project</label>
                    <select value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                        <option value="">No project</option>
                        {clientProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Status</label>
                    <select value={form.status} onChange={e => set('status', e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Issue Date</label>
                    <input type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label>Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label>Tax ($)</label>
                    <input type="number" value={form.tax} onChange={e => set('tax', e.target.value)} min="0" step="0.01" />
                </div>
            </div>

            <div className={`${styles.formGroup} ${styles.full}`} style={{ marginTop: 20 }}>
                <label>Line Items</label>
                <div className={styles.lineItems}>
                    <div className={styles.lineItemHeader}>
                        <span>Description</span>
                        <span>Qty</span>
                        <span>Rate ($)</span>
                        <span>Total</span>
                        <span></span>
                    </div>
                    {form.items.map((item, idx) => (
                        <div key={idx} className={styles.lineItemRow}>
                            <input value={item.description} onChange={e => setItem(idx, 'description', e.target.value)} placeholder="Service description" />
                            <input type="number" value={item.quantity} onChange={e => setItem(idx, 'quantity', e.target.value)} min="0" step="1" />
                            <input type="number" value={item.rate} onChange={e => setItem(idx, 'rate', e.target.value)} min="0" step="1" />
                            <span className={styles.lineTotal}>
                                {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}
                            </span>
                            <button type="button" className={styles.removeBtn} onClick={() => removeItem(idx)} disabled={form.items.length <= 1}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button type="button" className={`btn btn-ghost ${styles.addLineBtn}`} onClick={addItem}>
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            <div className={styles.invoiceSummary}>
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>Tax</span>
                    <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <div className={`${styles.formGroup} ${styles.full}`} style={{ marginTop: 16 }}>
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Payment instructions, thank you message..." />
            </div>

            <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">{initial ? 'Save Changes' : 'Create Invoice'}</button>
            </div>
        </form>
    )
}
