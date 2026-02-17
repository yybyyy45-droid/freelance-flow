import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Check } from 'lucide-react'
import styles from './Landing.module.css'

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect to get started',
        features: [
            '3 Active Clients',
            '5 Invoices / month',
            'Dashboard & Charts',
            'PDF Invoice Export',
            'Overdue Detection',
            'Email Support'
        ],
        cta: 'Get Started Free',
        highlight: false
    },
    {
        name: 'Pro',
        price: '$9',
        period: '/month',
        desc: 'For serious freelancers',
        features: [
            'Unlimited Clients',
            'Unlimited Invoices',
            'Auto Payment Reminders',
            'Revenue Analytics',
            'CSV & Report Export',
            'Priority Support',
            'Custom Invoice Templates',
            'Team Collaboration'
        ],
        cta: 'Start 14-Day Free Trial',
        highlight: true
    },
    {
        name: 'Agency',
        price: '$29',
        period: '/month',
        desc: 'For growing teams',
        features: [
            'Everything in Pro',
            'Up to 10 Team Members',
            'Client Portal',
            'White-Label Invoices',
            'API Access',
            'Dedicated Account Manager'
        ],
        cta: 'Contact Sales',
        highlight: false
    }
]

const faqs = [
    { q: 'Is FreelanceFlow really free?', a: 'Yes! The Free plan is free forever with no credit card required. You can upgrade to Pro when your business grows.' },
    { q: 'Can I try Pro before paying?', a: 'Absolutely. Pro comes with a 14-day free trial. Cancel anytime during the trial — no charges.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe. Annual plans get a 20% discount.' },
    { q: 'Can I export my data?', a: 'Yes. Export invoices, clients, projects, and financial reports as CSV files or PDF at any time.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use Supabase with Row Level Security. Your data is encrypted, isolated, and backed up.' },
]

export default function Pricing() {
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
                    <a href="/features">Features</a>
                    <a href="/pricing" style={{ color: 'var(--primary-light)' }}>Pricing</a>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
                        Get Started <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero} style={{ paddingBottom: '20px' }}>
                <h1 className={styles.heroTitle} style={{ fontSize: '2.6rem' }}>
                    Simple, transparent
                    <br />
                    <span className={styles.heroGrad}>pricing.</span>
                </h1>
                <p className={styles.heroDesc}>
                    Start free. No credit card required. Upgrade as your freelance business grows.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className={styles.pricing}>
                <div className={styles.pricingGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '1000px' }}>
                    {plans.map((plan, i) => (
                        <div key={i} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
                            {plan.highlight && <div className={styles.planBadge}>Most Popular</div>}
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{plan.desc}</p>
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

            {/* FAQ */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} className={styles.featureCard} style={{ textAlign: 'left' }}>
                            <h3 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{faq.q}</h3>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{faq.a}</p>
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
