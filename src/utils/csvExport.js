/**
 * CSV / Report Export Utilities
 * Generates downloadable CSV files for invoices, clients, projects, and summary reports.
 */

function escapeCSV(value) {
    if (value == null) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

function downloadCSV(filename, rows) {
    const csv = rows.map(row => row.map(escapeCSV).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

// ── Export Invoices ───────────────────────
export function exportInvoicesCSV(invoices, clients) {
    const header = ['Invoice #', 'Client', 'Status', 'Issue Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Notes']
    const rows = [header]

    invoices.forEach(inv => {
        const client = clients.find(c => c.id === inv.clientId)
        rows.push([
            inv.invoiceNumber,
            client?.name || 'N/A',
            inv.status,
            inv.issueDate || '',
            inv.dueDate || '',
            inv.subtotal || 0,
            inv.tax || 0,
            inv.total || 0,
            inv.notes || ''
        ])
    })

    downloadCSV(`freelanceflow-invoices-${new Date().toISOString().slice(0, 10)}.csv`, rows)
}

// ── Export Clients ────────────────────────
export function exportClientsCSV(clients) {
    const header = ['Name', 'Email', 'Phone', 'Company', 'Created']
    const rows = [header]

    clients.forEach(c => {
        rows.push([c.name, c.email || '', c.phone || '', c.company || '', c.createdAt || ''])
    })

    downloadCSV(`freelanceflow-clients-${new Date().toISOString().slice(0, 10)}.csv`, rows)
}

// ── Export Projects ───────────────────────
export function exportProjectsCSV(projects, clients) {
    const header = ['Name', 'Client', 'Status', 'Budget', 'Deadline', 'Description']
    const rows = [header]

    projects.forEach(p => {
        const client = clients.find(c => c.id === p.clientId)
        rows.push([p.name, client?.name || 'N/A', p.status, p.budget || 0, p.deadline || '', p.description || ''])
    })

    downloadCSV(`freelanceflow-projects-${new Date().toISOString().slice(0, 10)}.csv`, rows)
}

// ── Financial Summary Report ──────────────
export function exportSummaryCSV(invoices, clients) {
    const rows = []

    // Summary Header
    const paid = invoices.filter(i => i.status === 'paid')
    const pending = invoices.filter(i => i.status === 'sent')
    const overdue = invoices.filter(i => i.status === 'overdue')
    const draft = invoices.filter(i => i.status === 'draft')

    const totalEarned = paid.reduce((s, i) => s + (Number(i.total) || 0), 0)
    const totalPending = pending.reduce((s, i) => s + (Number(i.total) || 0), 0)
    const totalOverdue = overdue.reduce((s, i) => s + (Number(i.total) || 0), 0)

    rows.push(['FreelanceFlow Financial Summary'])
    rows.push(['Generated', new Date().toLocaleDateString()])
    rows.push([])
    rows.push(['OVERVIEW'])
    rows.push(['Total Invoices', invoices.length])
    rows.push(['Paid', paid.length, totalEarned])
    rows.push(['Pending', pending.length, totalPending])
    rows.push(['Overdue', overdue.length, totalOverdue])
    rows.push(['Draft', draft.length])
    rows.push([])

    // Revenue by client
    rows.push(['REVENUE BY CLIENT'])
    rows.push(['Client', 'Paid Amount', 'Pending Amount', 'Total Invoices'])
    const clientMap = {}
    invoices.forEach(inv => {
        const cid = inv.clientId || 'unknown'
        if (!clientMap[cid]) clientMap[cid] = { paid: 0, pending: 0, count: 0 }
        clientMap[cid].count++
        if (inv.status === 'paid') clientMap[cid].paid += Number(inv.total) || 0
        if (inv.status === 'sent') clientMap[cid].pending += Number(inv.total) || 0
    })
    Object.entries(clientMap).forEach(([cid, data]) => {
        const client = clients.find(c => c.id === cid)
        rows.push([client?.name || 'Unknown', data.paid, data.pending, data.count])
    })
    rows.push([])

    // Monthly breakdown
    rows.push(['MONTHLY REVENUE'])
    rows.push(['Month', 'Earned', 'Pending'])
    const monthMap = {}
    invoices.forEach(inv => {
        const d = inv.issueDate || inv.createdAt
        if (!d) return
        const key = d.slice(0, 7)
        if (!monthMap[key]) monthMap[key] = { earned: 0, pending: 0 }
        if (inv.status === 'paid') monthMap[key].earned += Number(inv.total) || 0
        if (inv.status === 'sent') monthMap[key].pending += Number(inv.total) || 0
    })
    Object.entries(monthMap).sort().forEach(([month, data]) => {
        rows.push([month, data.earned, data.pending])
    })

    downloadCSV(`freelanceflow-summary-${new Date().toISOString().slice(0, 10)}.csv`, rows)
}
