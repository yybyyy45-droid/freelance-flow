import { useState } from 'react'
import { Download, FileText, Users, FolderKanban, BarChart3 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import { exportInvoicesCSV, exportClientsCSV, exportProjectsCSV, exportSummaryCSV } from '../utils/csvExport'
import { formatCurrency } from '../utils/helpers'
import styles from './Reports.module.css'

export default function Reports() {
    const { invoices, clients, projects } = useData()
    const toast = useToast()

    const totalEarned = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (Number(i.total) || 0), 0)
    const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + (Number(i.total) || 0), 0)
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (Number(i.total) || 0), 0)

    const exportCards = [
        {
            icon: BarChart3, title: 'Financial Summary',
            desc: 'Overview, revenue by client, and monthly breakdown',
            color: 'var(--primary)',
            bg: 'rgba(124,58,237,0.12)',
            onClick: () => { exportSummaryCSV(invoices, clients); toast.success('Summary report downloaded') }
        },
        {
            icon: FileText, title: 'All Invoices',
            desc: `${invoices.length} invoices total`,
            color: 'var(--info)',
            bg: 'var(--info-bg)',
            onClick: () => { exportInvoicesCSV(invoices, clients); toast.success('Invoices CSV downloaded') }
        },
        {
            icon: Users, title: 'All Clients',
            desc: `${clients.length} clients total`,
            color: 'var(--success)',
            bg: 'var(--success-bg)',
            onClick: () => { exportClientsCSV(clients); toast.success('Clients CSV downloaded') }
        },
        {
            icon: FolderKanban, title: 'All Projects',
            desc: `${projects.length} projects total`,
            color: 'var(--warning)',
            bg: 'var(--warning-bg)',
            onClick: () => { exportProjectsCSV(projects, clients); toast.success('Projects CSV downloaded') }
        },
    ]

    return (
        <div className="animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Reports</h1>
                    <p className={styles.subtitle}>Export your data as CSV files</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
                <div className={styles.qStat}>
                    <span className={styles.qLabel}>Total Earned</span>
                    <span className={styles.qValue} style={{ color: 'var(--success)' }}>{formatCurrency(totalEarned)}</span>
                </div>
                <div className={styles.qStat}>
                    <span className={styles.qLabel}>Pending</span>
                    <span className={styles.qValue} style={{ color: 'var(--info)' }}>{formatCurrency(totalPending)}</span>
                </div>
                <div className={styles.qStat}>
                    <span className={styles.qLabel}>Overdue</span>
                    <span className={styles.qValue} style={{ color: 'var(--danger)' }}>{formatCurrency(totalOverdue)}</span>
                </div>
                <div className={styles.qStat}>
                    <span className={styles.qLabel}>Total Clients</span>
                    <span className={styles.qValue}>{clients.length}</span>
                </div>
            </div>

            {/* Export Cards */}
            <div className={styles.exportGrid}>
                {exportCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                        <button key={i} className={styles.exportCard} onClick={card.onClick}>
                            <div className={styles.exportIcon} style={{ background: card.bg, color: card.color }}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.exportInfo}>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </div>
                            <Download size={18} className={styles.downloadIcon} />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
