import { supabase } from '../lib/supabase'

/**
 * Overdue Invoice Detection & Reminder Utilities
 * 
 * Usage:
 *   - getOverdueInvoices(invoices) → returns invoices past due date
 *   - markOverdue(invoiceId) → updates status in Supabase
 *   - sendReminder(invoice, client) → logs a reminder activity
 */

export function getOverdueInvoices(invoices) {
    const today = new Date().toISOString().slice(0, 10)
    return invoices.filter(inv =>
        inv.status === 'sent' && inv.dueDate && inv.dueDate < today
    )
}

export function getDaysOverdue(dueDate) {
    if (!dueDate) return 0
    const due = new Date(dueDate)
    const now = new Date()
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
}

export async function markInvoiceOverdue(invoiceId) {
    const { error } = await supabase
        .from('invoices')
        .update({ status: 'overdue', updated_at: new Date().toISOString() })
        .eq('id', invoiceId)
    return { error }
}

export async function logReminderSent(userId, invoiceId, invoiceNumber) {
    await supabase.from('activity_logs').insert({
        user_id: userId,
        type: 'overdue',
        message: `Overdue reminder sent for invoice ${invoiceNumber}`,
        reference_id: invoiceId,
        reference_type: 'invoice'
    })
}

/**
 * Check all sent invoices and auto-mark overdue ones.
 * Returns the count of newly marked overdue invoices.
 */
export async function autoCheckOverdue(invoices, userId) {
    const overdue = getOverdueInvoices(invoices)
    let marked = 0
    for (const inv of overdue) {
        if (inv.status !== 'overdue') {
            const { error } = await markInvoiceOverdue(inv.id)
            if (!error) {
                await logReminderSent(userId, inv.id, inv.invoiceNumber)
                marked++
            }
        }
    }
    return marked
}
