import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart";
import { useAuthStore } from "../store/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const shippingCost = 10.00;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          guestEmail: !user ? formData.email : null,
          items,
          subtotal,
          shippingCost,
          total,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.country}, ${formData.postalCode}`
        })
      });

      if (!res.ok) throw new Error('Order failed');

      clearCart();
      setSuccess(true);
    } catch (err) {
      alert("Failed to process order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
        <Button asChild><a href="/">Return to Home</a></Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty.</p>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <Input 
                type="email" 
                placeholder="Email address" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                <Input placeholder="Last name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <Input placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                <Input placeholder="Country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required />
                <Input placeholder="Postal code" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} required />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="border rounded-md p-4 bg-muted/20 text-sm text-muted-foreground flex items-center justify-center h-24">
                Mock Payment Gateway: Click "Pay Now" to complete order.
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-card border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <hr className="my-2 border-muted" />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
