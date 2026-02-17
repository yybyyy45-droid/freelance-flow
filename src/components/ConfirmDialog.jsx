import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
    return (
        <Modal title={title || 'Confirm'} onClose={onCancel} width={420}>
            <div className={styles.content}>
                <div className={`${styles.iconWrap} ${danger ? styles.danger : ''}`}>
                    <AlertTriangle size={28} />
                </div>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    )
}
