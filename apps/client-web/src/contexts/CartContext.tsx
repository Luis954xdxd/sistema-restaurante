// Importamos ReactNode, useMemo y useState
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

// Importamos contexto
import { CartContext } from './cart-context';

// Importamos tipo del carrito
import type { CartItem } from '../modules/menu/types/menu.types';

// Props del provider
interface Props {
  children: ReactNode;
}

// Provider del carrito
export function CartProvider({ children }: Props) {
  // Estado principal del carrito
  const [items, setItems] = useState<CartItem[]>([]);

  // Agrega un producto al carrito
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      // Buscamos si el producto ya existe
      const existingItem = prev.find((cartItem) => cartItem.productId === item.productId);

      // Si ya existe, aumentamos cantidad
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      // Si no existe, lo agregamos con cantidad 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Incrementa cantidad de un producto
  const increaseItem = (productId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Disminuye cantidad de un producto
  const decreaseItem = (productId: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Elimina completamente un producto
  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Vacía el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Calculamos el total de artículos
  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  // Calculamos el monto total
  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  // Valor final del contexto
  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    }),
    [items, totalItems, totalAmount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}