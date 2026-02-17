import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generate a professional PDF invoice and trigger download.
 * @param {Object} invoice - The invoice object from DataContext
 * @param {Object} client  - The related client object
 * @param {Object} [profile] - Optional user profile (from, company info)
 */
export function generateInvoicePDF(invoice, client, profile = {}) {
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()

    // ── Brand colors ─────────────────
    const primary = [99, 102, 241]   // indigo
    const dark = [15, 23, 42]
    const muted = [100, 116, 139]
    const white = [255, 255, 255]

    // ── Header band ──────────────────
    doc.setFillColor(...primary)
    doc.rect(0, 0, pageW, 40, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(...white)
    doc.text('INVOICE', 20, 27)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.invoiceNumber || '', pageW - 20, 22, { align: 'right' })

    const statusLabel = (invoice.status || 'draft').toUpperCase()
    doc.setFontSize(9)
    doc.text(statusLabel, pageW - 20, 30, { align: 'right' })

    // ── From / To section ────────────
    let y = 55

    doc.setTextColor(...dark)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('FROM', 20, y)
    doc.text('BILL TO', 110, y)

    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    // From info
    const fromName = profile.full_name || profile.fullName || 'FreelanceFlow User'
    const fromCompany = profile.company || ''
    const fromEmail = profile.email || ''
    doc.text(fromName, 20, y)
    if (fromCompany) { y += 5; doc.text(fromCompany, 20, y) }
    if (fromEmail) { y += 5; doc.setTextColor(...muted); doc.text(fromEmail, 20, y); doc.setTextColor(...dark) }

    // To info
    let ty = 62
    const clientName = client?.name || 'N/A'
    const clientCompany = client?.company || ''
    const clientEmail = client?.email || ''
    doc.text(clientName, 110, ty)
    if (clientCompany) { ty += 5; doc.text(clientCompany, 110, ty) }
    if (clientEmail) { ty += 5; doc.setTextColor(...muted); doc.text(clientEmail, 110, ty); doc.setTextColor(...dark) }

    // ── Dates ────────────────────────
    y = Math.max(y, ty) + 15
    doc.setFontSize(9)
    doc.setTextColor(...muted)
    doc.text('Issue Date', 20, y)
    doc.text('Due Date', 80, y)
    if (invoice.paidDate) doc.text('Paid Date', 140, y)

    y += 6
    doc.setTextColor(...dark)
    doc.setFontSize(10)
    doc.text(fmtDate(invoice.issueDate), 20, y)
    doc.text(fmtDate(invoice.dueDate), 80, y)
    if (invoice.paidDate) doc.text(fmtDate(invoice.paidDate), 140, y)

    // ── Items table ──────────────────
    y += 12

    const items = (invoice.items || []).map((item, i) => [
        i + 1,
        item.description || '',
        item.quantity ?? 1,
        fmtCurrency(item.rate),
        fmtCurrency((item.quantity || 1) * (item.rate || 0))
    ])

    autoTable(doc, {
        startY: y,
        head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
        body: items,
        theme: 'grid',
        headStyles: {
            fillColor: primary,
            textColor: white,
            fontStyle: 'bold',
            fontSize: 9
        },
        bodyStyles: {
            fontSize: 9,
            textColor: dark
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 22, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    })

    // ── Totals ───────────────────────
    const finalY = doc.lastAutoTable.finalY + 10
    const totalsX = pageW - 20

    doc.setFontSize(10)
    doc.setTextColor(...muted)
    doc.text('Subtotal', totalsX - 50, finalY)
    doc.setTextColor(...dark)
    doc.text(fmtCurrency(invoice.subtotal), totalsX, finalY, { align: 'right' })

    if (invoice.tax) {
        doc.setTextColor(...muted)
        doc.text('Tax', totalsX - 50, finalY + 8)
        doc.setTextColor(...dark)
        doc.text(fmtCurrency(invoice.tax), totalsX, finalY + 8, { align: 'right' })
    }

    const totalY = finalY + (invoice.tax ? 20 : 12)
    doc.setDrawColor(...primary)
    doc.setLineWidth(0.5)
    doc.line(totalsX - 60, totalY - 4, totalsX, totalY - 4)

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primary)
    doc.text('TOTAL', totalsX - 50, totalY + 2)
    doc.text(fmtCurrency(invoice.total), totalsX, totalY + 2, { align: 'right' })

    // ── Notes ────────────────────────
    if (invoice.notes) {
        const notesY = totalY + 18
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(...muted)
        doc.text('NOTES', 20, notesY)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...dark)
        doc.setFontSize(9)
        const lines = doc.splitTextToSize(invoice.notes, pageW - 40)
        doc.text(lines, 20, notesY + 7)
    }

    // ── Footer ───────────────────────
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setFontSize(8)
    doc.setTextColor(...muted)
    doc.text('Generated by FreelanceFlow', 20, footerY)
    doc.text(`Page 1 of 1`, pageW - 20, footerY, { align: 'right' })

    // ── Save ─────────────────────────
    doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`)
}

// ── Local formatters (no locale dependency) ──
function fmtCurrency(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
