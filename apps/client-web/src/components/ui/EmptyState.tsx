// Props del estado vacío
interface Props {
  title: string;
  description: string;
}

// Componente de estado vacío reutilizable
function EmptyState({ title, description }: Props) {
  return (
    <div className="client-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;