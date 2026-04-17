// ==============================
// 📦 CATEGORÍA DEL MENÚ
// ==============================
export interface MenuCategory {
  id: number; // ID único de la categoría
  name: string; // Nombre (Ej: Bebidas, Comidas)
  description: string | null; // Descripción opcional
  isActive: boolean; // Si está activa o no
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de actualización
}

// ==============================
// 🍔 PRODUCTO DEL MENÚ
// ==============================
export interface MenuProduct {
  id: number; // ID del producto
  name: string; // Nombre del producto
  description: string | null; // Descripción
  price: string; // Precio (viene como string desde backend)
  imageUrl: string | null; // Imagen opcional
  isAvailable: boolean; // Disponible para venta
  categoryId: number; // Relación con categoría
  createdAt: string; // Fecha creación
  updatedAt: string; // Fecha actualización

  // Relación con categoría
  category: MenuCategory;
}

// ==============================
// 📊 RESPUESTA DEL BACKEND
// ==============================
export interface MenuProductsResponse {
  message: string; // Mensaje del backend
  data: MenuProduct[]; // Lista de productos
  pagination: {
    page: number; // Página actual
    limit: number; // Cantidad por página
    totalItems: number; // Total de registros
    totalPages: number; // Total de páginas
    hasNextPage: boolean; // Si hay siguiente página
    hasPreviousPage: boolean; // Si hay anterior
  };
}

// ==============================
// 🛒 ITEM DEL CARRITO
// ==============================
export interface CartItem {
  productId: number; // ID del producto
  name: string; // Nombre
  price: number; // Precio ya convertido a número
  imageUrl: string | null; // Imagen
  quantity: number; // Cantidad en carrito
}