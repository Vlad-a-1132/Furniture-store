export interface Review {
  id: string;
  comment: string;
  rating: number;
  images: string[];
  isApproved: boolean;
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  specifications: Record<string, string>;
  price: number;
  images: string[];
  defaultImage: string;
  categoryId?: string;
  subcategoryId?: string;
  thirdLevelId?: string;
  inStock: boolean;
  discount?: number;
  material: string;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  category?: Category;
  subcategory?: Category;
  thirdLevel?: Category;
  colorVariants: ColorVariant[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specification {
  key: string;
  value: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  user?: User;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  user?: User;
  product?: Product;
  createdAt: Date;
}

export interface AdminCart {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: Date;
}

export interface AdminFavorite {
  id: string;
  productId: string;
  product?: Product;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Promocode {
  id: string;
  code: string;
  discount: number;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 