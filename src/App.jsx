import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// ── Eager: public pages (fast first paint) ──────
import Landing from './pages/Landing'
import Features from './pages/Features'
import Pricing from './pages/Pricing'

// ── Lazy: auth + app pages (code-split) ─────────
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Invoices = lazy(() => import('./pages/Invoices'))
const Clients = lazy(() => import('./pages/Clients'))
const Projects = lazy(() => import('./pages/Projects'))
const Settings = lazy(() => import('./pages/Settings'))
const Reports = lazy(() => import('./pages/Reports'))

function PageLoader() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', color: 'var(--text-muted)', fontSize: '0.9rem'
        }}>
            Loading…
        </div>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <ToastProvider>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/features" element={<Features />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/invoices" element={<Invoices />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/reports" element={<Reports />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </ToastProvider>
            </DataProvider>
        </AuthProvider>
    )
}
