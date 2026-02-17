import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, FolderKanban, BarChart3, Settings, Zap, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Zap size={22} />
                </div>
                <span className={styles.logoText}>FreelanceFlow</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map(item => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            <div className={styles.bottom}>
                <div className={styles.userCard}>
                    <div className={styles.userAvatar}>{initials}</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{displayName}</span>
                        <span className={styles.userPlan}>{user?.email}</span>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={handleSignOut} title="退出登录">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    )
}
