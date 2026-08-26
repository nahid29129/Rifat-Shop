import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [stock, setStock] = useState("");
  const [animalType, setAnimalType] = useState("dog");
  const [categoryId, setCategoryId] = useState("cat-1");

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setCurrentProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCompareAtPrice("");
    setImage("");
    setImagesText("");
    setStock("10");
    setAnimalType("dog");
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setCurrentProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price.toString());
    setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : "");
    setImage(p.image);
    setImagesText(p.images ? p.images.join("\n") : "");
    setStock(p.stock.toString());
    setAnimalType(p.animalType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, description, 
      price: parseFloat(price), 
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      image, 
      images: imagesText.split('\n').map(s => s.trim()).filter(Boolean),
      stock: parseInt(stock),
      animalType, categoryId
    };

    const method = currentProduct ? 'PUT' : 'POST';
    const url = currentProduct ? `/api/products/${currentProduct.id}` : '/api/products';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1">Manage your store's inventory.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Inventory</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {products.map(product => (
                  <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border" />
                        <span className="font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle capitalize">{product.animalType}</td>
                    <td className="p-4 align-middle">{product.stock} in stock</td>
                    <td className="p-4 align-middle">${product.price.toFixed(2)}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10">
              <h3 className="text-xl font-bold">{currentProduct ? "Edit Product" : "Add Product"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Compare At Price (Optional)</label>
                  <Input type="number" step="0.01" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required value={description} onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input type="number" required value={stock} onChange={e => setStock(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Animal Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={animalType} onChange={e => setAnimalType(e.target.value)}
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Image URL</label>
                <Input required value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
                {image && <img src={image} alt="Preview" className="h-20 rounded-md border object-cover mt-2" />}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Image URLs (One per line)</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={imagesText} onChange={e => setImagesText(e.target.value)} placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Product</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
