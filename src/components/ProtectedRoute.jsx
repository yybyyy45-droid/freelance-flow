import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--bg-app)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" />
                    <p style={{ marginTop: 12 }}>正在加载...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}
