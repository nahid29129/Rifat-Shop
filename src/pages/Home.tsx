import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(() => {
        // Fallback mock data for GitHub Pages static hosting
        setFeaturedProducts([
          { id: "1", name: "Interactive Treat Puzzle Toy", price: 24.99, compareAtPrice: 29.99, image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop" },
          { id: "2", name: "Orthopedic Dog Bed", price: 89.99, compareAtPrice: 109.99, image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop" },
          { id: "3", name: "Interactive Feather Cat Toy", price: 34.99, image: "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?q=80&w=2070&auto=format&fit=crop" },
          { id: "4", name: "Cozy Cat Bed", price: 45.00, compareAtPrice: 55.00, image: "https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?q=80&w=2069&auto=format&fit=crop" }
        ]);
      });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop" 
            alt="Happy dogs running" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Better Products for <br />
              <span className="text-primary">Happier Pets.</span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Discover thoughtfully selected, premium products made for the dogs and cats you love. Delivered internationally.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg">
                <Link to="/shop?animal=dog">Shop Dog Products</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base shadow-md">
                <Link to="/shop?animal=cat">Shop Cat Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-16 px-4 md:px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                  {product.compareAtPrice && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded-sm shadow-sm">
                      SALE
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop By Pet */}
      <section className="container mx-auto py-16 px-4 md:px-6 bg-muted/30">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Shop by Pet</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Link to="/shop?animal=dog" className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop" 
              alt="Dogs" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-bold text-white mb-2">Dogs</h3>
              <span className="inline-block border-b-2 border-white text-white font-medium pb-1">Shop Now</span>
            </div>
          </Link>
          <Link to="/shop?animal=cat" className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" 
              alt="Cats" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-bold text-white mb-2">Cats</h3>
              <span className="inline-block border-b-2 border-white text-white font-medium pb-1">Shop Now</span>
            </div>
          </Link>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto max-w-xl space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Join the Rifat Shop Family</h2>
            <p className="text-muted-foreground">Sign up for our newsletter to get 10% off your first order and receive updates on new products.</p>
            <form className="flex flex-col gap-2 sm:flex-row mt-6">
              <input type="email" placeholder="Enter your email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1" />
              <Button type="button">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
