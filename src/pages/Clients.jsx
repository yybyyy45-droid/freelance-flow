import { useState } from 'react'
import { Plus, Search, Mail, Phone, Edit2, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ClientForm from '../components/forms/ClientForm'
import { formatCurrency } from '../utils/helpers'
import styles from './Clients.module.css'

export default function Clients() {
    const { clients, invoices, projects, addClient, updateClient, deleteClient } = useData()
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const filtered = clients.filter(c => {
        if (!search) return true
        const q = search.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    })

    const getClientStats = (clientId) => {
        const clientInvoices = invoices.filter(i => i.clientId === clientId)
        const totalRevenue = clientInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
        const pending = clientInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0)
        const projectCount = projects.filter(p => p.clientId === clientId).length
        return { totalRevenue, pending, projectCount }
    }

    const handleCreate = (data) => {
        addClient(data)
        setShowForm(false)
        toast.success('Client added successfully')
    }

    const handleEdit = (data) => {
        updateClient(editing.id, data)
        setEditing(null)
        toast.success('Client updated')
    }

    const handleDelete = () => {
        deleteClient(deleting.id)
        setDeleting(null)
        toast.success('Client deleted')
    }

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Clients</h1>
                    <p className={styles.subtitle}>{clients.length} total clients</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> Add Client
                </button>
            </div>

            <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search clients..." value={search}
                    onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
            </div>

            <div className={styles.grid}>
                {filtered.map(client => {
                    const stats = getClientStats(client.id)
                    return (
                        <div key={client.id} className={`card card-interactive ${styles.clientCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatarWrap}>
                                    <span className={styles.avatar}>{client.avatar}</span>
                                    <div>
                                        <h3 className={styles.name}>{client.name}</h3>
                                        <span className={styles.company}>{client.company}</span>
                                    </div>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditing(client)}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn btn-ghost btn-icon btn-sm" title="Delete" onClick={() => setDeleting(client)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.contact}>
                                <a href={`mailto:${client.email}`} className={styles.contactItem}>
                                    <Mail size={14} /> {client.email}
                                </a>
                                {client.phone && (
                                    <a href={`tel:${client.phone}`} className={styles.contactItem}>
                                        <Phone size={14} /> {client.phone}
                                    </a>
                                )}
                            </div>

                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Revenue</span>
                                    <span className={`${styles.statValue} text-success`}>{formatCurrency(stats.totalRevenue)}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Pending</span>
                                    <span className={`${styles.statValue} text-warning`}>{formatCurrency(stats.pending)}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Projects</span>
                                    <span className={styles.statValue}>{stats.projectCount}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <h3>No clients found</h3>
                        <p>Try a different search or add your first client.</p>
                    </div>
                )}
            </div>

            {showForm && (
                <Modal title="Add Client" onClose={() => setShowForm(false)}>
                    <ClientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
                </Modal>
            )}

            {editing && (
                <Modal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
                    <ClientForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
                </Modal>
            )}

            {deleting && (
                <ConfirmDialog
                    title="Delete Client"
                    message={`Are you sure you want to delete ${deleting.name}? All associated data will remain but won't be linked.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleting(null)}
                />
            )}
        </div>
    )
}
