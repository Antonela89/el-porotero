import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthForm, ProtectedRoute } from '@/components';
import { AuthLayout, AppLayout } from '@/layout';
import { DashboardPage, NewMatchPage, MatchDetailPage, StatsPage } from '@/pages';

const AppLayoutWrapper = () => (
    <AppLayout>
        <Outlet />
    </AppLayout>
);

const AuthLayoutWrapper = () => (
    <AuthLayout>
        <Outlet />
    </AuthLayout>
)

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route element={<AuthLayoutWrapper />}>
                    <Route path="/login" element={<AuthForm mode="login" />} />
                    <Route path="/register" element={<AuthForm mode="register" />} />
                </Route>
                {/* Rutas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayoutWrapper />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/stats" element={<StatsPage />} />
                        <Route path="/new-match" element={<NewMatchPage />} />
                    </Route>
                    <Route path="/match/:id" element={<MatchDetailPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};