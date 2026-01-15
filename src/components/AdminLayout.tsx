import { Outlet, Navigate } from 'react-router-dom';
import { AdminNavbar } from '@/components/AdminNavbar';
import { useAuthStore } from '@/stores/authStore';

export function AdminLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
