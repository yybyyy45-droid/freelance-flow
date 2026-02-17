import { useMemo } from 'react'
import styles from './Charts.module.css'

// ── Revenue Trend (Bar Chart) ────────────────────
export function RevenueChart({ invoices }) {
    const months = useMemo(() => {
        const map = {}
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            map[key] = { label: d.toLocaleString('en-US', { month: 'short' }), earned: 0, pending: 0 }
        }
        invoices.forEach(inv => {
            const d = inv.issueDate || inv.createdAt
            if (!d) return
            const key = d.slice(0, 7)
            if (!map[key]) return
            if (inv.status === 'paid') map[key].earned += Number(inv.total) || 0
            else map[key].pending += Number(inv.total) || 0
        })
        return Object.values(map)
    }, [invoices])

    const max = Math.max(1, ...months.map(m => m.earned + m.pending))

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Revenue Trend</h3>
            <p className={styles.chartSub}>Last 6 months</p>
            <div className={styles.barChart}>
                {months.map((m, i) => (
                    <div key={i} className={styles.barCol}>
                        <div className={styles.barTrack}>
                            <div className={styles.barPending} style={{ height: `${((m.pending) / max) * 100}%` }} />
                            <div className={styles.barEarned} style={{ height: `${((m.earned) / max) * 100}%` }} />
                        </div>
                        <span className={styles.barLabel}>{m.label}</span>
                    </div>
                ))}
            </div>
            <div className={styles.legend}>
                <span><i className={styles.dotEarned} /> Earned</span>
                <span><i className={styles.dotPending} /> Pending</span>
            </div>
        </div>
    )
}

// ── Invoice Status (Donut Chart) ─────────────────
export function InvoiceStatusChart({ invoices }) {
    const counts = useMemo(() => {
        const c = { paid: 0, sent: 0, overdue: 0, draft: 0 }
        invoices.forEach(inv => { if (c[inv.status] !== undefined) c[inv.status]++ })
        return c
    }, [invoices])

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const segments = [
        { key: 'paid', label: 'Paid', color: 'var(--success)', count: counts.paid },
        { key: 'sent', label: 'Sent', color: 'var(--info)', count: counts.sent },
        { key: 'overdue', label: 'Overdue', color: 'var(--danger)', count: counts.overdue },
        { key: 'draft', label: 'Draft', color: 'var(--text-muted)', count: counts.draft },
    ]

    // Build SVG donut
    const R = 52, C = 2 * Math.PI * R
    let offset = 0

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Invoice Status</h3>
            <p className={styles.chartSub}>{total === 1 && Object.values(counts).every(c => c === 0) ? 'No invoices' : `${total} total`}</p>
            <div className={styles.donutWrap}>
                <svg viewBox="0 0 120 120" className={styles.donut}>
                    {segments.map(seg => {
                        const pct = seg.count / total
                        const dashLen = pct * C
                        const el = (
                            <circle key={seg.key} cx="60" cy="60" r={R} fill="none"
                                stroke={seg.color} strokeWidth="12" strokeLinecap="round"
                                strokeDasharray={`${dashLen} ${C - dashLen}`}
                                strokeDashoffset={-offset}
                                style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }} />
                        )
                        offset += dashLen
                        return el
                    })}
                    <text x="60" y="56" textAnchor="middle" className={styles.donutVal}>
                        {counts.paid}
                    </text>
                    <text x="60" y="72" textAnchor="middle" className={styles.donutLabel}>
                        paid
                    </text>
                </svg>
                <div className={styles.donutLegend}>
                    {segments.map(s => (
                        <div key={s.key} className={styles.donutLegendItem}>
                            <i style={{ background: s.color }} className={styles.legendDot} />
                            <span>{s.label}</span>
                            <strong>{s.count}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Top Clients (Horizontal Bars) ────────────────
export function TopClientsChart({ invoices, clients }) {
    const data = useMemo(() => {
        const map = {}
        invoices.filter(i => i.status === 'paid').forEach(inv => {
            if (!inv.clientId) return
            map[inv.clientId] = (map[inv.clientId] || 0) + (Number(inv.total) || 0)
        })
        return Object.entries(map)
            .map(([id, total]) => ({ client: clients.find(c => c.id === id), total }))
            .filter(d => d.client)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
    }, [invoices, clients])

    const maxVal = Math.max(1, ...data.map(d => d.total))

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Top Clients</h3>
            <p className={styles.chartSub}>By revenue</p>
            {data.length === 0 ? (
                <p className={styles.emptyChart}>No paid invoices yet</p>
            ) : (
                <div className={styles.hBars}>
                    {data.map(d => (
                        <div key={d.client.id} className={styles.hBarRow}>
                            <span className={styles.hBarName}>{d.client.name}</span>
                            <div className={styles.hBarTrack}>
                                <div className={styles.hBarFill} style={{ width: `${(d.total / maxVal) * 100}%` }} />
                            </div>
                            <span className={styles.hBarVal}>${d.total.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
