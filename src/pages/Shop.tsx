import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCartStore } from "../store/cart";

export function Shop() {
  const [searchParams] = useSearchParams();
  const animalType = searchParams.get("animal");
  const [products, setProducts] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (animalType) {
          setProducts(data.filter((p: any) => p.animalType === animalType || p.animalType === 'both'));
        } else {
          setProducts(data);
        }
      });
  }, [animalType]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {animalType === 'dog' ? 'Dog Products' : animalType === 'cat' ? 'Cat Products' : 'All Products'}
        </h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden flex flex-col group border-0 shadow-md transition-shadow hover:shadow-xl">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
              {product.compareAtPrice && (
                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded-sm shadow-sm">
                  SALE
                </div>
              )}
            </div>
            <CardContent className="p-4 flex flex-col flex-1">
              <Link to={`/product/${product.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
                  )}
                </div>
                <Button onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock })}>
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
