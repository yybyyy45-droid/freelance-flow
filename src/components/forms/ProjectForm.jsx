import { useState } from 'react'
import { useData } from '../../context/DataContext'
import styles from './Forms.module.css'

export default function ProjectForm({ initial, onSubmit, onCancel }) {
    const { clients } = useData()
    const [form, setForm] = useState({
        clientId: initial?.clientId || (clients[0]?.id || ''),
        name: initial?.name || '',
        description: initial?.description || '',
        status: initial?.status || 'draft',
        budget: initial?.budget || '',
        spent: initial?.spent || 0,
        startDate: initial?.startDate || new Date().toISOString().slice(0, 10),
        dueDate: initial?.dueDate || ''
    })

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name.trim() || !form.clientId) return
        onSubmit({
            ...form,
            budget: parseFloat(form.budget) || 0,
            spent: parseFloat(form.spent) || 0
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Project Name *</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Website Redesign" required />
                </div>
                <div className={styles.formGroup}>
                    <label>Client *</label>
                    <select value={form.clientId} onChange={e => set('clientId', e.target.value)} required>
                        <option value="">Select client...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Status</label>
                    <select value={form.status} onChange={e => set('status', e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Budget ($)</label>
                    <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="5000" min="0" step="100" />
                </div>
                <div className={styles.formGroup}>
                    <label>Spent ($)</label>
                    <input type="number" value={form.spent} onChange={e => set('spent', e.target.value)} placeholder="0" min="0" step="100" />
                </div>
                <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label>Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Project scope and details..." />
                </div>
            </div>
            <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">{initial ? 'Save Changes' : 'Create Project'}</button>
            </div>
        </form>
    )
}
