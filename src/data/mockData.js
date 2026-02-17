// FreelanceFlow Mock Data
export const clients = [
    {
        id: 'c1',
        name: 'Sarah Chen',
        email: 'sarah@techvision.io',
        company: 'TechVision Inc.',
        phone: '+1-555-0101',
        avatar: '👩‍💻',
        createdAt: '2025-09-15',
        notes: 'Prefers Slack for communication. Always pays on time.'
    },
    {
        id: 'c2',
        name: 'Marcus Johnson',
        email: 'marcus@blueridge.co',
        company: 'BlueRidge Creative',
        phone: '+1-555-0202',
        avatar: '👨‍🎨',
        createdAt: '2025-10-03',
        notes: 'Net 30 terms. Needs detailed breakdowns.'
    },
    {
        id: 'c3',
        name: 'Elena Rodriguez',
        email: 'elena@sunflower.org',
        company: 'Sunflower Media',
        phone: '+44-20-7946-0958',
        avatar: '👩‍💼',
        createdAt: '2025-11-20',
        notes: 'UK timezone. Prefers email updates.'
    },
    {
        id: 'c4',
        name: 'David Park',
        email: 'david@novastart.com',
        company: 'NovaStart Labs',
        phone: '+1-555-0404',
        avatar: '🧑‍🔬',
        createdAt: '2026-01-05',
        notes: 'Startup. Budget-conscious but fair.'
    }
]

export const projects = [
    {
        id: 'p1',
        clientId: 'c1',
        name: 'E-commerce Platform Redesign',
        status: 'in-progress',
        budget: 12000,
        spent: 7200,
        startDate: '2025-11-01',
        dueDate: '2026-03-15',
        description: 'Complete redesign of the online store with new checkout flow and mobile optimization.'
    },
    {
        id: 'p2',
        clientId: 'c2',
        name: 'Brand Identity Package',
        status: 'completed',
        budget: 4500,
        spent: 4500,
        startDate: '2025-10-15',
        dueDate: '2025-12-20',
        description: 'Full brand identity including logo, color palette, typography, and brand guidelines.'
    },
    {
        id: 'p3',
        clientId: 'c3',
        name: 'Content Marketing Strategy',
        status: 'in-progress',
        budget: 6000,
        spent: 2400,
        startDate: '2026-01-10',
        dueDate: '2026-04-30',
        description: 'Quarterly content plan with SEO-optimized blog posts and social media calendar.'
    },
    {
        id: 'p4',
        clientId: 'c1',
        name: 'Mobile App UI/UX',
        status: 'draft',
        budget: 8000,
        spent: 0,
        startDate: '2026-03-01',
        dueDate: '2026-06-30',
        description: 'iOS and Android app design with interactive prototypes.'
    },
    {
        id: 'p5',
        clientId: 'c4',
        name: 'Landing Page Development',
        status: 'on-hold',
        budget: 3000,
        spent: 1200,
        startDate: '2026-01-20',
        dueDate: '2026-02-28',
        description: 'High-converting landing page with A/B testing setup.'
    }
]

export const invoices = [
    {
        id: 'inv-001',
        clientId: 'c2',
        projectId: 'p2',
        invoiceNumber: 'INV-001',
        status: 'paid',
        items: [
            { description: 'Logo Design & Concepts (3 rounds)', quantity: 1, rate: 1500 },
            { description: 'Brand Guidelines Document', quantity: 1, rate: 1200 },
            { description: 'Business Card & Stationery Design', quantity: 1, rate: 800 },
            { description: 'Social Media Kit', quantity: 1, rate: 1000 }
        ],
        subtotal: 4500,
        tax: 0,
        total: 4500,
        issueDate: '2025-12-20',
        dueDate: '2026-01-20',
        paidDate: '2026-01-18',
        notes: 'Thank you for the collaboration!'
    },
    {
        id: 'inv-002',
        clientId: 'c1',
        projectId: 'p1',
        invoiceNumber: 'INV-002',
        status: 'paid',
        items: [
            { description: 'Discovery & Research Phase', quantity: 20, rate: 120 },
            { description: 'Wireframing & Prototyping', quantity: 30, rate: 120 }
        ],
        subtotal: 6000,
        tax: 0,
        total: 6000,
        issueDate: '2026-01-05',
        dueDate: '2026-02-05',
        paidDate: '2026-02-01',
        notes: 'Milestone 1 of 2 — Design phase'
    },
    {
        id: 'inv-003',
        clientId: 'c3',
        projectId: 'p3',
        invoiceNumber: 'INV-003',
        status: 'sent',
        items: [
            { description: 'Content Strategy Workshop', quantity: 8, rate: 150 },
            { description: 'Blog Post Writing (5 articles)', quantity: 5, rate: 200 }
        ],
        subtotal: 2200,
        tax: 220,
        total: 2420,
        issueDate: '2026-02-01',
        dueDate: '2026-03-01',
        paidDate: null,
        notes: 'VAT included. Payment via bank transfer.'
    },
    {
        id: 'inv-004',
        clientId: 'c1',
        projectId: 'p1',
        invoiceNumber: 'INV-004',
        status: 'overdue',
        items: [
            { description: 'Frontend Development', quantity: 40, rate: 130 },
            { description: 'Backend Integration', quantity: 15, rate: 140 }
        ],
        subtotal: 7300,
        tax: 0,
        total: 7300,
        issueDate: '2026-01-20',
        dueDate: '2026-02-10',
        paidDate: null,
        notes: 'Milestone 2 — Development phase. Please settle ASAP.'
    },
    {
        id: 'inv-005',
        clientId: 'c4',
        projectId: 'p5',
        invoiceNumber: 'INV-005',
        status: 'draft',
        items: [
            { description: 'Landing Page Design', quantity: 1, rate: 1200 }
        ],
        subtotal: 1200,
        tax: 0,
        total: 1200,
        issueDate: '2026-02-15',
        dueDate: '2026-03-15',
        paidDate: null,
        notes: 'Deposit for Phase 1'
    }
]

export const recentActivity = [
    { id: 'a1', type: 'payment', message: 'Marcus Johnson paid INV-001', amount: 4500, date: '2026-01-18', icon: '💰' },
    { id: 'a2', type: 'payment', message: 'Sarah Chen paid INV-002', amount: 6000, date: '2026-02-01', icon: '💰' },
    { id: 'a3', type: 'invoice', message: 'Invoice INV-003 sent to Elena Rodriguez', amount: 2420, date: '2026-02-01', icon: '📤' },
    { id: 'a4', type: 'overdue', message: 'Invoice INV-004 is overdue (Sarah Chen)', amount: 7300, date: '2026-02-11', icon: '⚠️' },
    { id: 'a5', type: 'project', message: 'New project "Mobile App UI/UX" created', amount: null, date: '2026-02-14', icon: '📁' },
]
