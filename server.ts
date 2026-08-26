import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { migrate } from "drizzle-orm/libsql/migrator";
import { v4 as uuidv4 } from 'uuid';

async function setupDb() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete.");

    // Seed admin
    const admins = await db.select().from(schema.users).where(eq(schema.users.role, 'admin'));
    if (admins.length === 0) {
      console.log("Seeding admin user...");
      const hashedPassword = await bcrypt.hash("29102004", 10);
      await db.insert(schema.users).values({
        id: "admin-" + Date.now(),
        email: "rifat291",
        password: hashedPassword,
        name: "Admin Rifat",
        role: "admin",
        createdAt: new Date(),
      });
      console.log("Admin seeded.");
    }

    // Seed categories and products
    const cats = await db.select().from(schema.categories);
    if (cats.length === 0) {
      console.log("Seeding categories and products...");
      await db.insert(schema.categories).values([
        { id: "cat-1", name: "Dog Toys", slug: "dog-toys", type: "dog", description: "Toys for dogs" },
        { id: "cat-2", name: "Dog Beds", slug: "dog-beds", type: "dog", description: "Beds for dogs" },
        { id: "cat-3", name: "Cat Toys", slug: "cat-toys", type: "cat", description: "Toys for cats" },
        { id: "cat-4", name: "Cat Beds", slug: "cat-beds", type: "cat", description: "Beds for cats" },
      ]);

      await db.insert(schema.products).values([
        {
          id: "prod-1", name: "Interactive Treat Puzzle Toy", description: "Keeps your dog busy and mentally stimulated.",
          price: 24.99, compareAtPrice: 29.99, categoryId: "cat-1", animalType: "dog",
          image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop",
          images: ["https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2000&auto=format&fit=crop"],
          stock: 50, rating: 4.8, reviewCount: 124, isFeatured: true, isNew: true, createdAt: new Date()
        },
        {
          id: "prod-2", name: "Orthopedic Dog Bed", description: "Premium memory foam for maximum comfort.",
          price: 89.99, compareAtPrice: 109.99, categoryId: "cat-2", animalType: "dog",
          image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop",
          stock: 20, rating: 4.9, reviewCount: 89, isFeatured: true, isNew: false, createdAt: new Date()
        },
        {
          id: "prod-3", name: "Interactive Feather Cat Toy", description: "A highly engaging automatic laser and feather toy.",
          price: 34.99, categoryId: "cat-3", animalType: "cat",
          image: "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?q=80&w=2070&auto=format&fit=crop",
          stock: 100, rating: 4.7, reviewCount: 56, isFeatured: true, isNew: true, createdAt: new Date()
        },
        {
          id: "prod-4", name: "Cozy Cat Bed", description: "Warm and cozy plush bed for deep sleep.",
          price: 45.00, compareAtPrice: 55.00, categoryId: "cat-4", animalType: "cat",
          image: "https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?q=80&w=2069&auto=format&fit=crop",
          stock: 15, rating: 4.5, reviewCount: 42, isFeatured: false, isNew: false, createdAt: new Date()
        }
      ]);
      console.log("Demo products seeded.");
    }
  } catch (error) {
    console.error("Database setup error:", error);
  }
}

async function startServer() {
  await setupDb();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  
  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.select().from(schema.users).where(eq(schema.users.email, email)).get();
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, sign a JWT here. For demo, we just send a mock token.
      const token = `mock-jwt-${user.id}-${user.role}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get Products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(schema.products);
      res.json(allProducts);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get Single Product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await db.select().from(schema.products).where(eq(schema.products.id, req.params.id)).get();
      if (!product) return res.status(404).json({ error: "Not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create Product (Admin)
  app.post("/api/products", async (req, res) => {
    try {
      const newProduct = {
        id: "prod-" + uuidv4(),
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        compareAtPrice: req.body.compareAtPrice || null,
        categoryId: req.body.categoryId,
        animalType: req.body.animalType,
        image: req.body.image,
        images: req.body.images || [],
        stock: req.body.stock || 0,
        createdAt: new Date(),
      };
      await db.insert(schema.products).values(newProduct);
      res.json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update Product (Admin)
  app.put("/api/products/:id", async (req, res) => {
    try {
      await db.update(schema.products).set({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        compareAtPrice: req.body.compareAtPrice || null,
        categoryId: req.body.categoryId,
        animalType: req.body.animalType,
        image: req.body.image,
        images: req.body.images || [],
        stock: req.body.stock || 0,
      }).where(eq(schema.products.id, req.params.id));
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete Product (Admin)
  app.delete("/api/products/:id", async (req, res) => {
    try {
      await db.delete(schema.products).where(eq(schema.products.id, req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create Order
  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, guestEmail, items, subtotal, shippingCost, total, shippingAddress } = req.body;
      const orderId = "order-" + uuidv4();

      await db.insert(schema.orders).values({
        id: orderId,
        userId: userId || null,
        guestEmail,
        total,
        subtotal,
        shippingCost,
        shippingAddress,
        createdAt: new Date(),
        status: 'paid' // mock immediate payment
      });

      for (const item of items) {
        await db.insert(schema.orderItems).values({
          id: "item-" + uuidv4(),
          orderId,
          productId: item.id,
          quantity: item.quantity,
          priceAtTime: item.price
        });
        
        // Decrement stock
        const product = await db.select().from(schema.products).where(eq(schema.products.id, item.id)).get();
        if (product) {
          await db.update(schema.products)
            .set({ stock: product.stock - item.quantity })
            .where(eq(schema.products.id, item.id));
        }
      }

      res.json({ success: true, orderId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Order failed" });
    }
  });

  // Admin Get Orders
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const allOrders = await db.select().from(schema.orders).orderBy(schema.orders.createdAt);
      res.json(allOrders);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
