import { useState } from 'react'
import { Plus, Search, Calendar, Edit2, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ProjectForm from '../components/forms/ProjectForm'
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, getProgressPercent } from '../utils/helpers'
import styles from './Projects.module.css'

const statusFilters = ['all', 'in-progress', 'completed', 'draft', 'on-hold']

export default function Projects() {
    const { projects, clients, addProject, updateProject, deleteProject } = useData()
    const toast = useToast()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const filtered = projects.filter(p => {
        if (filter !== 'all' && p.status !== filter) return false
        if (search) {
            const q = search.toLowerCase()
            return p.name.toLowerCase().includes(q)
        }
        return true
    })

    const handleCreate = (data) => {
        addProject(data)
        setShowForm(false)
        toast.success('Project created successfully')
    }

    const handleEdit = (data) => {
        updateProject(editing.id, data)
        setEditing(null)
        toast.success('Project updated')
    }

    const handleDelete = () => {
        deleteProject(deleting.id)
        setDeleting(null)
        toast.success('Project deleted')
    }

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Projects</h1>
                    <p className={styles.subtitle}>{projects.length} projects total</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input type="text" placeholder="Search projects..." value={search}
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

            <div className={styles.grid}>
                {filtered.map(project => {
                    const client = clients.find(c => c.id === project.clientId)
                    const progress = getProgressPercent(project.spent, project.budget)
                    const progressColor = progress >= 100 ? 'var(--danger)' : progress >= 75 ? 'var(--warning)' : 'var(--primary)'

                    return (
                        <div key={project.id} className={`card card-interactive ${styles.projectCard}`}>
                            <div className={styles.cardTop}>
                                <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                                <div className={styles.cardActions}>
                                    <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditing(project)}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn btn-ghost btn-icon btn-sm" title="Delete" onClick={() => setDeleting(project)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className={styles.projectName}>{project.name}</h3>
                            <p className={styles.projectDesc}>{project.description}</p>

                            {client && (
                                <div className={styles.clientTag}>
                                    <span className={styles.clientEmoji}>{client.avatar}</span>
                                    {client.name}
                                </div>
                            )}

                            <div className={styles.budgetSection}>
                                <div className={styles.budgetHeader}>
                                    <span className="text-secondary">Budget Used</span>
                                    <span style={{ color: progressColor, fontWeight: 700 }}>{progress}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%`, background: progressColor }} />
                                </div>
                                <div className={styles.budgetFooter}>
                                    <span>{formatCurrency(project.spent)} spent</span>
                                    <span>{formatCurrency(project.budget)} budget</span>
                                </div>
                            </div>

                            {project.dueDate && (
                                <div className={styles.dueDate}>
                                    <Calendar size={14} /> Due {formatDate(project.dueDate)}
                                </div>
                            )}
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <h3>No projects found</h3>
                        <p>Try a different filter or create a new project.</p>
                    </div>
                )}
            </div>

            {showForm && (
                <Modal title="New Project" onClose={() => setShowForm(false)}>
                    <ProjectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
                </Modal>
            )}

            {editing && (
                <Modal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
                    <ProjectForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
                </Modal>
            )}

            {deleting && (
                <ConfirmDialog
                    title="Delete Project"
                    message={`Are you sure you want to delete "${deleting.name}"? This cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleting(null)}
                />
            )}
        </div>
    )
}
