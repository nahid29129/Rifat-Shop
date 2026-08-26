import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { useCartStore } from "../store/cart";
import { useAuthStore } from "../store/auth";

export function Header() {
  const { getTotals } = useCartStore();
  const { count } = getTotals();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">Rifat Shop</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
            <Link to="/shop?animal=dog" className="text-sm font-medium hover:text-primary transition-colors">Dogs</Link>
            <Link to="/shop?animal=cat" className="text-sm font-medium hover:text-primary transition-colors">Cats</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          
          <div className="group relative">
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => !user && navigate('/login')}>
              <User className="h-5 w-5" />
            </button>
            {user && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-2 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-2 py-1.5 text-sm font-medium truncate">{user.name}</div>
                <hr className="my-1 border-muted" />
                {user.role === 'admin' && (
                  <Link to="/admin" className="block rounded-sm px-2 py-1.5 text-sm hover:bg-muted">Admin Dashboard</Link>
                )}
                <Link to="/account" className="block rounded-sm px-2 py-1.5 text-sm hover:bg-muted">My Account</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-muted text-destructive">Logout</button>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative text-muted-foreground hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
