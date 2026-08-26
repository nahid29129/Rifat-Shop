import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { Package, ShoppingCart, Users, LayoutDashboard, Settings, LogOut, Tags } from "lucide-react";

export function AdminLayout() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-muted/20">
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="text-xl font-bold tracking-tight">Rifat Shop Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <Package className="h-4 w-4" /> Products
          </Link>
          <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <Tags className="h-4 w-4" /> Categories
          </Link>
          <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <Users className="h-4 w-4" /> Customers
          </Link>
          <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-muted/10 p-8">
        <Outlet />
      </main>
    </div>
  );
}
