// Importamos header reutilizable
import PageHeader from '../../../components/ui/PageHeader';

// Importamos estilos UI
import '../../../components/ui/ui.css';

// Página base de inventario del empleado
function InventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Aquí conectaremos el módulo operativo de inventario del empleado"
      />

      <div>
        Aquí después agregaremos stock, movimientos y alertas para el empleado.
      </div>
    </div>
  );
}

export default InventoryPage;