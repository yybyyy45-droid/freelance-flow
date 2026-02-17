import { useState } from 'react'
import { Plus, Search, Send, Edit2, Trash2, CheckCircle, Download } from 'lucide-react'
import { generateInvoicePDF } from '../utils/pdfGenerator'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import InvoiceForm from '../components/forms/InvoiceForm'
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, getDaysUntilDue } from '../utils/helpers'
import styles from './Invoices.module.css'

const statusFilters = ['all', 'draft', 'sent', 'paid', 'overdue']

export default function Invoices() {
    const { invoices, clients, addInvoice, updateInvoice, deleteInvoice, markInvoicePaid } = useData()
    const toast = useToast()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const filtered = invoices.filter(inv => {
        if (filter !== 'all' && inv.status !== filter) return false
        if (search) {
            const client = clients.find(c => c.id === inv.clientId)
            const q = search.toLowerCase()
            return inv.invoiceNumber.toLowerCase().includes(q) || client?.name.toLowerCase().includes(q)
        }
        return true
    })

    const totalAll = invoices.reduce((s, i) => s + i.total, 0)
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

    const handleCreate = (data) => {
        addInvoice(data)
        setShowForm(false)
        toast.success('Invoice created successfully')
    }

    const handleEdit = (data) => {
        updateInvoice(editing.id, data)
        setEditing(null)
        toast.success('Invoice updated')
    }

    const handleDelete = () => {
        deleteInvoice(deleting.id)
        setDeleting(null)
        toast.success('Invoice deleted')
    }

    const handleMarkPaid = (inv) => {
        markInvoicePaid(inv.id)
        toast.success(`${inv.invoiceNumber} marked as paid`)
    }

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invoices</h1>
                    <p className={styles.subtitle}>
                        {formatCurrency(totalPaid)} collected of {formatCurrency(totalAll)} total
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> Create Invoice
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input type="text" placeholder="Search invoices..." value={search}
                        onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
                </div>
                <div className={styles.filters}>
                    {statusFilters.map(s => (
                        <button key={s} className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`}
                            onClick={() => setFilter(s)}>
                            {s === 'all' ? 'All' : getStatusLabel(s)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(inv => {
                            const client = clients.find(c => c.id === inv.clientId)
                            const daysUntil = getDaysUntilDue(inv.dueDate)
                            return (
                                <tr key={inv.id}>
                                    <td><span style={{ fontWeight: 700 }}>{inv.invoiceNumber}</span></td>
                                    <td>
                                        <div className={styles.clientCell}>
                                            <span className={styles.clientAvatar}>{client?.avatar}</span>
                                            <div>
                                                <span className={styles.clientName}>{client?.name}</span>
                                                <span className={styles.clientCompany}>{client?.company}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>{formatCurrency(inv.total)}</td>
                                    <td className="text-secondary">{formatDate(inv.issueDate)}</td>
                                    <td>
                                        <span className={inv.status === 'overdue' ? 'text-danger' : 'text-secondary'}>
                                            {formatDate(inv.dueDate)}
                                        </span>
                                        {inv.status === 'sent' && daysUntil <= 7 && daysUntil > 0 && (
                                            <span className={styles.dueSoon}>{daysUntil}d left</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(inv.status)}`}>
                                            {getStatusLabel(inv.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className="btn btn-ghost btn-icon" title="Download PDF" onClick={() => generateInvoicePDF(inv, client)}>
                                                <Download size={16} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => setEditing(inv)}>
                                                <Edit2 size={16} />
                                            </button>
                                            {(inv.status === 'sent' || inv.status === 'overdue') && (
                                                <button className="btn btn-ghost btn-icon" title="Mark Paid" onClick={() => handleMarkPaid(inv)}>
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button className="btn btn-ghost btn-icon" title="Delete" onClick={() => setDeleting(inv)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No invoices found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title="Create Invoice" onClose={() => setShowForm(false)} width={640}>
                    <InvoiceForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
                </Modal>
            )}

            {editing && (
                <Modal title={`Edit ${editing.invoiceNumber}`} onClose={() => setEditing(null)} width={640}>
                    <InvoiceForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
                </Modal>
            )}

            {deleting && (
                <ConfirmDialog
                    title="Delete Invoice"
                    message={`Are you sure you want to delete ${deleting.invoiceNumber}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleting(null)}
                />
            )}
        </div>
    )
}
