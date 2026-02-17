import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3200)
    }, [])

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info')
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {createPortal(
                <div className={styles.container}>
                    {toasts.map(t => (
                        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
                            <span className={styles.icon}>
                                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
                            </span>
                            {t.message}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
