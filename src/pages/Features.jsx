import { useNavigate } from 'react-router-dom'
import {
    Zap, FileText, Clock, Users, FolderKanban, ArrowRight,
    BarChart3, Download, Shield, Globe, Bell, Settings
} from 'lucide-react'
import styles from './Landing.module.css'

const featureGroups = [
    {
        category: 'Invoicing',
        items: [
            { icon: FileText, title: 'Professional Invoices', desc: 'Create branded invoices with line items, taxes, and custom notes. Your clients will be impressed.' },
            { icon: Download, title: 'PDF & CSV Export', desc: 'Download invoices as polished PDFs. Export your data as CSV for accounting software.' },
            { icon: Bell, title: 'Auto Reminders', desc: 'Overdue invoices are automatically detected. Never chase payments manually again.' },
        ]
    },
    {
        category: 'Client & Project Management',
        items: [
            { icon: Users, title: 'Client Hub', desc: 'Store contact details, track revenue per client, and see all linked invoices and projects at a glance.' },
            { icon: FolderKanban, title: 'Project Tracking', desc: 'Track budgets, deadlines, and progress for every project. Know exactly where things stand.' },
            { icon: BarChart3, title: 'Revenue Analytics', desc: 'Interactive dashboard charts show monthly trends, invoice breakdown, and top clients.' },
        ]
    },
    {
        category: 'Security & Settings',
        items: [
            { icon: Shield, title: 'Bank-Level Security', desc: 'Powered by Supabase with Row Level Security. Your data is encrypted and isolated per user.' },
            { icon: Settings, title: 'Customizable', desc: 'Set default currency, tax rate, invoice prefix, payment terms, and notification preferences.' },
            { icon: Globe, title: 'Works Everywhere', desc: 'Responsive design works beautifully on desktop, tablet, and mobile. Access from any device.' },
        ]
    }
]

export default function Features() {
    const navigate = useNavigate()

    return (
        <div className={styles.landing}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navBrand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className={styles.navLogo}><Zap size={20} /></div>
                    <span>FreelanceFlow</span>
                </div>
                <div className={styles.navLinks}>
                    <a href="/features" style={{ color: 'var(--primary-light)' }}>Features</a>
                    <a href="/pricing">Pricing</a>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
                        Get Started <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero} style={{ paddingBottom: '40px' }}>
                <h1 className={styles.heroTitle} style={{ fontSize: '2.6rem' }}>
                    All the tools you need,
                    <br />
                    <span className={styles.heroGrad}>in one simple app.</span>
                </h1>
                <p className={styles.heroDesc}>
                    FreelanceFlow combines invoicing, client management, project tracking, and analytics
                    into a beautiful, free tool built specifically for freelancers.
                </p>
            </section>

            {/* Feature Groups */}
            {featureGroups.map((group, gi) => (
                <section key={gi} className={styles.features} style={{ paddingTop: gi === 0 ? '20px' : '60px' }}>
                    <h2 className={styles.sectionTitle}>{group.category}</h2>
                    <div className={styles.featureGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {group.items.map((f, i) => {
                            const Icon = f.icon
                            return (
                                <div key={i} className={styles.featureCard}>
                                    <div className={styles.featureIcon}><Icon size={24} /></div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            ))}

            {/* CTA */}
            <section className={styles.hero} style={{ paddingTop: '40px', paddingBottom: '60px' }}>
                <h2 className={styles.sectionTitle}>Ready to simplify your freelance life?</h2>
                <div className={styles.heroCta} style={{ marginTop: '16px' }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                        Start Free <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerBrand}>
                    <Zap size={18} />
                    <span>FreelanceFlow</span>
                </div>
                <p>© 2026 FreelanceFlow. Built with ❤️ for freelancers worldwide.</p>
            </footer>
        </div>
    )
}
