// Importamos createContext
import { createContext } from 'react';

// Importamos tipo del carrito
import type { CartItem } from '../modules/menu/types/menu.types';

// Estructura del contexto del carrito
export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  increaseItem: (productId: number) => void;
  decreaseItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

// Creamos el contexto
export const CartContext = createContext<CartContextValue | null>(null);