import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-foreground">Rifat Shop</h4>
            <p className="text-sm leading-relaxed">
              Premium international pet products for the dogs and cats you love. Thoughtfully selected, globally delivered.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?animal=dog" className="hover:text-primary transition-colors">Dog Products</Link></li>
              <li><Link to="/shop?animal=cat" className="hover:text-primary transition-colors">Cat Products</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping Information</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} Rifat Shop. All rights reserved.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            {/* Payment icons mock */}
            <span className="font-semibold text-foreground">USD Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
