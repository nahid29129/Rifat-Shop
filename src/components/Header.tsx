import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { useCartStore } from "../store/cart";

export function Header() {
  const { getTotals } = useCartStore();
  const { count } = getTotals();
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
