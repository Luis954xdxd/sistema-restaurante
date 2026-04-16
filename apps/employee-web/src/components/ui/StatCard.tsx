// Importamos motion para animaciones
import { motion } from 'framer-motion';

// Props del stat card
interface Props {
  title: string;
  value: string | number;
}

// Card de estadística reutilizable
function StatCard({ title, value }: Props) {
  return (
    <motion.div
      className="employee-stat-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <span className="employee-stat-card-label">{title}</span>
      <strong className="employee-stat-card-value">{value}</strong>
    </motion.div>
  );
}

export default StatCard;