import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm, ProtectedRoute } from '@/components';
import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardPage, NewMatchPage, MatchDetailPage } from '@/pages';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={
                    <AuthLayout><AuthForm mode="login" /></AuthLayout>
                } />
                <Route path="/register" element={
                    <AuthLayout><AuthForm mode="register" /></AuthLayout>
                } />

                {/* Rutas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/new-match" element={<NewMatchPage />} />
                    <Route path="/match/:id" element={<MatchDetailPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};