import { useNavigate } from 'react-router-dom'
import { Zap, FileText, Clock, Users, FolderKanban, ArrowRight, Check, Star } from 'lucide-react'
import styles from './Landing.module.css'

const features = [
    {
        icon: FileText,
        title: 'Smart Invoicing',
        desc: 'Create professional invoices in seconds. Auto-calculate totals, taxes, and track every payment.'
    },
    {
        icon: Clock,
        title: 'Auto Reminders',
        desc: 'Never chase payments manually again. Automated reminders keep your cash flow healthy.'
    },
    {
        icon: Users,
        title: 'Client Hub',
        desc: 'All your clients, projects, and invoices linked together. One click to see the full picture.'
    },
    {
        icon: FolderKanban,
        title: 'Project Tracking',
        desc: 'Track budgets, deadlines, and progress. Know exactly where every project stands.'
    }
]

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        features: ['3 Clients', '5 Invoices/month', 'Basic Dashboard', 'Email Support'],
        cta: 'Get Started',
        highlight: false
    },
    {
        name: 'Pro',
        price: '$9',
        period: '/month',
        features: ['Unlimited Clients', 'Unlimited Invoices', 'Auto Reminders', 'Revenue Analytics', 'Priority Support', 'Export to PDF'],
        cta: 'Start Free Trial',
        highlight: true
    }
]

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className={styles.landing}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navBrand}>
                    <div className={styles.navLogo}><Zap size={20} /></div>
                    <span>FreelanceFlow</span>
                </div>
                <div className={styles.navLinks}>
                    <a href="/features">Features</a>
                    <a href="/pricing">Pricing</a>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
                        Get Started <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <Star size={14} /> Built for Freelancers
                </div>
                <h1 className={styles.heroTitle}>
                    Stop chasing payments.
                    <br />
                    <span className={styles.heroGrad}>Start getting paid.</span>
                </h1>
                <p className={styles.heroDesc}>
                    Invoices, clients, projects, and payment reminders — all in one
                    beautifully simple tool. No more spreadsheet chaos.
                </p>
                <div className={styles.heroCta}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                        Get Started Free <ArrowRight size={18} />
                    </button>
                    <span className={styles.heroNote}>No credit card required</span>
                </div>
                <div className={styles.heroStats}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>$2.4M+</span>
                        <span className={styles.statLabel}>Invoiced</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>1,200+</span>
                        <span className={styles.statLabel}>Freelancers</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>98%</span>
                        <span className={styles.statLabel}>Paid on time</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className={styles.features}>
                <h2 className={styles.sectionTitle}>Everything you need, nothing you don't</h2>
                <p className={styles.sectionDesc}>Built by freelancers who got tired of juggling 6 different tools.</p>
                <div className={styles.featureGrid}>
                    {features.map((f, i) => {
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

            {/* Pricing */}
            <section id="pricing" className={styles.pricing}>
                <h2 className={styles.sectionTitle}>Simple, honest pricing</h2>
                <p className={styles.sectionDesc}>Start free. Upgrade when you're ready.</p>
                <div className={styles.pricingGrid}>
                    {plans.map((plan, i) => (
                        <div key={i} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
                            {plan.highlight && <div className={styles.planBadge}>Most Popular</div>}
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.planPrice}>
                                <span className={styles.priceAmount}>{plan.price}</span>
                                <span className={styles.pricePeriod}>{plan.period}</span>
                            </div>
                            <ul className={styles.planFeatures}>
                                {plan.features.map((f, j) => (
                                    <li key={j}><Check size={16} /> {f}</li>
                                ))}
                            </ul>
                            <button
                                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                                style={{ width: '100%' }}
                                onClick={() => navigate('/signup')}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
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
