import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCartStore } from "../store/cart";
import { ArrowLeft } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setMainImage(data.image);
      })
      .catch(() => {
        // Fallback mock data for GitHub Pages static hosting
        const mockProduct = { 
          id: id, 
          name: "Preview Static Product", 
          description: "This is a static preview product because the backend API is not running on GitHub Pages. You can see how the design looks here.", 
          price: 29.99, 
          animalType: "dog", 
          image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop", 
          stock: 10, 
          images: [
            "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2000&auto=format&fit=crop"
          ]
        };
        setProduct(mockProduct);
        setMainImage(mockProduct.image);
      });
  }, [id]);

  if (!product) return <div className="container mx-auto p-16 text-center">Loading...</div>;

  const allImages = [product.image, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link to="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Link>
      
      <div className="grid gap-12 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
            <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-muted-foreground'}`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize bg-primary/10 text-primary">
              {product.animalType}
            </span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-green-600 bg-green-50">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-destructive bg-destructive/10">
                Out of Stock
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6 flex items-end gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through mb-1">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-auto pt-8 border-t">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-12"
              disabled={product.stock <= 0}
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock })}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
