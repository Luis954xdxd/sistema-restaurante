interface Props {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{title}</span>
      <strong className="stat-card-value">{value}</strong>
    </div>
  );
}

export default StatCard;