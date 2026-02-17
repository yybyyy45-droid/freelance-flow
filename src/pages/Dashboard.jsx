import { useEffect, useState } from 'react'
import { DollarSign, Clock, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../utils/helpers'
import { RevenueChart, InvoiceStatusChart, TopClientsChart } from '../components/Charts'
import { autoCheckOverdue, getOverdueInvoices, getDaysOverdue } from '../utils/overdueReminder'
import styles from './Dashboard.module.css'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { invoices, clients, projects, activity, refreshData } = useData()
    const [overdueCount, setOverdueCount] = useState(0)

    // Auto-detect and mark overdue invoices on load
    useEffect(() => {
        if (!user || !invoices.length) return
        async function check() {
            const marked = await autoCheckOverdue(invoices, user.id)
            if (marked > 0) {
                setOverdueCount(marked)
                if (refreshData) refreshData()
            }
        }
        check()
    }, [user, invoices.length])

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

    const totalEarned = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
    const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0)
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0)
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in-progress').length

    const stats = [
        { label: 'Total Earned', value: formatCurrency(totalEarned), icon: DollarSign, color: 'var(--success)', bg: 'var(--success-bg)' },
        { label: 'Pending', value: formatCurrency(totalPending), icon: Clock, color: 'var(--info)', bg: 'var(--info-bg)' },
        { label: 'Overdue', value: formatCurrency(totalOverdue), icon: AlertTriangle, color: 'var(--danger)', bg: 'var(--danger-bg)' },
        { label: 'Active Projects', value: activeProjects, icon: TrendingUp, color: 'var(--primary-light)', bg: 'rgba(124,58,237,0.12)' },
    ]

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, {userName}! Here's your overview.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/invoices')}>
                    <Plus size={18} /> New Invoice
                </button>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <div key={i} className={`card ${styles.statCard}`}>
                            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <p className={styles.statLabel}>{s.label}</p>
                                <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Charts Row ────────────────── */}
            <div className={styles.chartsRow}>
                <RevenueChart invoices={invoices} />
                <InvoiceStatusChart invoices={invoices} />
                <TopClientsChart invoices={invoices} clients={clients} />
            </div>

            <div className={styles.grid}>
                <div className={`card ${styles.recentCard}`}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Invoices</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/invoices')}>View All</button>
                    </div>
                    <div className="table-container" style={{ border: 'none' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Client</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.slice(0, 4).map(inv => {
                                    const client = clients.find(c => c.id === inv.clientId)
                                    return (
                                        <tr key={inv.id}>
                                            <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                                            <td className="text-secondary">{client?.name}</td>
                                            <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                                            <td><span className={`badge ${getStatusBadgeClass(inv.status)}`}>{getStatusLabel(inv.status)}</span></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`card ${styles.activityCard}`}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Activity</h3>
                    </div>
                    <div className={styles.activityList}>
                        {activity.slice(0, 6).map(a => (
                            <div key={a.id} className={styles.activityItem}>
                                <span className={styles.activityIcon}>{a.icon}</span>
                                <div className={styles.activityContent}>
                                    <p>{a.message}</p>
                                    <span className={styles.activityDate}>{formatDate(a.date)}</span>
                                </div>
                                {a.amount && (
                                    <span className={styles.activityAmount}>
                                        {a.type === 'overdue' ? '-' : '+'}{formatCurrency(a.amount)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
