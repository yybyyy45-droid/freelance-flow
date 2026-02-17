import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

export default function Modal({ title, children, onClose, width = 560 }) {
    const overlayRef = useRef(null)

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return createPortal(
        <div className={styles.overlay} ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}>
            <div className={styles.modal} style={{ maxWidth: width }}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.close} onClick={onClose}><X size={20} /></button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>,
        document.body
    )
}
