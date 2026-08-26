import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('customer'), // 'customer' | 'admin'
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'dog' | 'cat'
  description: text('description'),
  image: text('image'),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  compareAtPrice: real('compare_at_price'),
  categoryId: text('category_id').references(() => categories.id),
  animalType: text('animal_type').notNull(), // 'dog' | 'cat' | 'both'
  image: text('image').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>(),
  stock: integer('stock').notNull().default(0),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
  sku: text('sku').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // nullable for guest checkout
  guestEmail: text('guest_email'),
  status: text('status').notNull().default('pending'), // pending, paid, processing, shipped, delivered, cancelled
  total: real('total').notNull(),
  subtotal: real('subtotal').notNull(),
  shippingCost: real('shipping_cost').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtTime: real('price_at_time').notNull(),
});

export const wishlist = sqliteTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
});
