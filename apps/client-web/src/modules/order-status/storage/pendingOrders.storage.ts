// Clave que usaremos en localStorage.
const PENDING_ORDERS_KEY = 'restaurant_pending_order_ids';

// Obtener IDs de pedidos pendientes.
export function getPendingOrderIds(): number[] {
  // Leemos datos guardados.
  const rawValue = localStorage.getItem(PENDING_ORDERS_KEY);

  // Si no existe nada, regresamos lista vacía.
  if (!rawValue) return [];

  try {
    // Convertimos JSON a arreglo.
    const parsedValue = JSON.parse(rawValue);

    // Validamos que realmente sea arreglo.
    if (!Array.isArray(parsedValue)) return [];

    // Regresamos solo números válidos.
    return parsedValue.filter(
      (id) => typeof id === 'number' && Number.isInteger(id) && id > 0
    );
  } catch {
    // Si localStorage tiene algo corrupto, regresamos vacío.
    return [];
  }
}

// Guardar lista completa de pedidos pendientes.
function savePendingOrderIds(orderIds: number[]) {
  // Quitamos duplicados.
  const uniqueOrderIds = [...new Set(orderIds)];

  // Guardamos en localStorage.
  localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(uniqueOrderIds));
}

// Agregar un pedido a pendientes.
export function addPendingOrderId(orderId: number) {
  // Si no es válido, no hacemos nada.
  if (!Number.isInteger(orderId) || orderId <= 0) return;

  // Obtenemos los actuales.
  const currentOrderIds = getPendingOrderIds();

  // Guardamos agregando el nuevo.
  savePendingOrderIds([...currentOrderIds, orderId]);
}

// Quitar un pedido de pendientes.
export function removePendingOrderId(orderId: number) {
  // Obtenemos los actuales.
  const currentOrderIds = getPendingOrderIds();

  // Quitamos el pedido indicado.
  const updatedOrderIds = currentOrderIds.filter((id) => id !== orderId);

  // Guardamos la nueva lista.
  savePendingOrderIds(updatedOrderIds);
}

// Saber cuántos pedidos pendientes hay.
export function getPendingOrdersCount() {
  return getPendingOrderIds().length;
}