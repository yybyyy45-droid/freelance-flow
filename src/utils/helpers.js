export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

export function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export function getStatusBadgeClass(status) {
    const map = {
        paid: 'badge-success',
        sent: 'badge-info',
        overdue: 'badge-danger',
        draft: 'badge-neutral',
        'in-progress': 'badge-info',
        completed: 'badge-success',
        'on-hold': 'badge-warning'
    }
    return map[status] || 'badge-neutral'
}

export function getStatusLabel(status) {
    const map = {
        paid: 'Paid',
        sent: 'Sent',
        overdue: 'Overdue',
        draft: 'Draft',
        'in-progress': 'In Progress',
        completed: 'Completed',
        'on-hold': 'On Hold'
    }
    return map[status] || status
}

export function getDaysUntilDue(dueDate) {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diff
}

export function getProgressPercent(spent, budget) {
    if (!budget) return 0
    return Math.min(Math.round((spent / budget) * 100), 100)
}
