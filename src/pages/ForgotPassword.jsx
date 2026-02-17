import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function ForgotPassword() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            await resetPassword(email)
            setSuccess('重置链接已发送到你的邮箱，请查收。')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}><Zap size={18} /></div>
                    FreelanceFlow
                </div>
                <h2 className={styles.heading}>重置密码</h2>
                <p className={styles.subheading}>输入你的邮箱地址，我们将发送重置链接</p>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>邮箱</label>
                        <input type="email" placeholder="name@example.com" value={email}
                            onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : '发送重置链接'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link to="/login">← 返回登录</Link>
                </div>
            </div>
        </div>
    )
}
