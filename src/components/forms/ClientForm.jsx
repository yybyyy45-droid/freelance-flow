import { useState } from 'react'
import styles from './Forms.module.css'

const avatars = ['👩‍💻', '👨‍🎨', '👩‍💼', '🧑‍🔬', '👨‍💻', '👩‍🎤', '🧑‍🏫', '👨‍⚕️']

export default function ClientForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: initial?.name || '',
        email: initial?.email || '',
        company: initial?.company || '',
        phone: initial?.phone || '',
        avatar: initial?.avatar || '👩‍💻',
        notes: initial?.notes || ''
    })

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name.trim() || !form.email.trim()) return
        onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" required />
                </div>
                <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" required />
                </div>
                <div className={styles.formGroup}>
                    <label>Company</label>
                    <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Inc." />
                </div>
                <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1-555-0000" />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Avatar</label>
                    <div className={styles.avatarPicker}>
                        {avatars.map(a => (
                            <button key={a} type="button" className={`${styles.avatarOption} ${form.avatar === a ? styles.selected : ''}`}
                                onClick={() => set('avatar', a)}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Notes</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Communication preferences, payment terms..." />
                </div>
            </div>
            <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">{initial ? 'Save Changes' : 'Add Client'}</button>
            </div>
        </form>
    )
}
