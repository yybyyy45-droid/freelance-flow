import { useState, useEffect } from 'react'
import { Save, User, FileText, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'
import styles from './Settings.module.css'

export default function Settings() {
    const { user } = useAuth()
    const toast = useToast()
    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)

    // ── Profile state ────────────────
    const [profile, setProfile] = useState({
        full_name: '', company: '', email: '', phone: '', currency: 'USD', tax_rate: 0
    })

    // ── Invoice prefs state ──────────
    const [invoicePrefs, setInvoicePrefs] = useState({
        invoice_prefix: 'INV', payment_terms: '30', default_notes: 'Thank you for your business!'
    })

    // ── Notif prefs state ────────────
    const [notifPrefs, setNotifPrefs] = useState({
        email_invoices: true, email_payments: true, email_overdue: true, email_weekly: false
    })

    // ── Load profile from Supabase ───
    useEffect(() => {
        if (!user) return
        async function load() {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    company: data.company || '',
                    email: data.email || user.email || '',
                    phone: data.phone || '',
                    currency: data.currency || 'USD',
                    tax_rate: data.tax_rate || 0
                })
                setInvoicePrefs(prev => ({
                    ...prev,
                    invoice_prefix: data.invoice_prefix || 'INV'
                }))
            }
        }
        load()
    }, [user])

    const handleProfileSave = async () => {
        setSaving(true)
        const { error } = await supabase.from('profiles').update({
            full_name: profile.full_name,
            company: profile.company,
            phone: profile.phone,
            currency: profile.currency,
            tax_rate: profile.tax_rate,
            invoice_prefix: invoicePrefs.invoice_prefix,
            updated_at: new Date().toISOString()
        }).eq('id', user.id)
        setSaving(false)
        if (error) { toast.error('Failed to save'); return }
        toast.success('Profile saved successfully')
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'invoice', label: 'Invoice', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ]

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>Manage your account and preferences</p>
                </div>
                <button className="btn btn-primary" onClick={handleProfileSave} disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>

            <div className={styles.layout}>
                {/* Tab Navigation */}
                <div className={styles.tabs}>
                    {tabs.map(t => {
                        const Icon = t.icon
                        return (
                            <button key={t.id}
                                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(t.id)}>
                                <Icon size={18} />
                                <span>{t.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <div className={`card ${styles.section}`}>
                            <h3 className={styles.sectionTitle}>Personal Information</h3>
                            <p className={styles.sectionDesc}>Update your personal details</p>
                            <div className={styles.formGrid}>
                                <div className={styles.field}>
                                    <label>Full Name</label>
                                    <input type="text" value={profile.full_name}
                                        onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                                        placeholder="Your full name" />
                                </div>
                                <div className={styles.field}>
                                    <label>Email</label>
                                    <input type="email" value={profile.email} disabled
                                        className={styles.disabledInput} />
                                    <span className={styles.fieldHint}>Managed by Supabase Auth</span>
                                </div>
                                <div className={styles.field}>
                                    <label>Company</label>
                                    <input type="text" value={profile.company}
                                        onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                                        placeholder="Company name" />
                                </div>
                                <div className={styles.field}>
                                    <label>Phone</label>
                                    <input type="tel" value={profile.phone}
                                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="+1 555 000 0000" />
                                </div>
                                <div className={styles.field}>
                                    <label>Default Currency</label>
                                    <select value={profile.currency}
                                        onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))}>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="CNY">CNY (¥)</option>
                                        <option value="JPY">JPY (¥)</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Default Tax Rate (%)</label>
                                    <input type="number" value={profile.tax_rate} min={0} max={100} step={0.1}
                                        onChange={e => setProfile(p => ({ ...p, tax_rate: parseFloat(e.target.value) || 0 }))} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'invoice' && (
                        <div className={`card ${styles.section}`}>
                            <h3 className={styles.sectionTitle}>Invoice Preferences</h3>
                            <p className={styles.sectionDesc}>Customize how your invoices look</p>
                            <div className={styles.formGrid}>
                                <div className={styles.field}>
                                    <label>Invoice Prefix</label>
                                    <input type="text" value={invoicePrefs.invoice_prefix}
                                        onChange={e => setInvoicePrefs(p => ({ ...p, invoice_prefix: e.target.value }))}
                                        placeholder="INV" />
                                    <span className={styles.fieldHint}>e.g. INV-001, BILL-001</span>
                                </div>
                                <div className={styles.field}>
                                    <label>Payment Terms (days)</label>
                                    <select value={invoicePrefs.payment_terms}
                                        onChange={e => setInvoicePrefs(p => ({ ...p, payment_terms: e.target.value }))}>
                                        <option value="7">Net 7</option>
                                        <option value="15">Net 15</option>
                                        <option value="30">Net 30</option>
                                        <option value="45">Net 45</option>
                                        <option value="60">Net 60</option>
                                    </select>
                                </div>
                                <div className={`${styles.field} ${styles.fieldFull}`}>
                                    <label>Default Invoice Notes</label>
                                    <textarea rows={3} value={invoicePrefs.default_notes}
                                        onChange={e => setInvoicePrefs(p => ({ ...p, default_notes: e.target.value }))}
                                        placeholder="Thank you for your business!" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={`card ${styles.section}`}>
                            <h3 className={styles.sectionTitle}>Email Notifications</h3>
                            <p className={styles.sectionDesc}>Choose which emails you'd like to receive</p>
                            <div className={styles.toggleList}>
                                {[
                                    { key: 'email_invoices', label: 'New Invoice', desc: 'When a new invoice is created' },
                                    { key: 'email_payments', label: 'Payment Received', desc: 'When a payment is recorded' },
                                    { key: 'email_overdue', label: 'Overdue Reminders', desc: 'When an invoice becomes overdue' },
                                    { key: 'email_weekly', label: 'Weekly Summary', desc: 'Weekly digest of your activity' },
                                ].map(item => (
                                    <div key={item.key} className={styles.toggleRow}>
                                        <div>
                                            <p className={styles.toggleLabel}>{item.label}</p>
                                            <p className={styles.toggleDesc}>{item.desc}</p>
                                        </div>
                                        <label className={styles.toggle}>
                                            <input type="checkbox" checked={notifPrefs[item.key]}
                                                onChange={e => setNotifPrefs(p => ({ ...p, [item.key]: e.target.checked }))} />
                                            <span className={styles.slider} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
