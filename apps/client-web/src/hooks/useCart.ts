// Importamos useContext
import { useContext } from 'react';

// Importamos contexto del carrito
import { CartContext } from '../contexts/cart-context';

// Hook personalizado del carrito
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}