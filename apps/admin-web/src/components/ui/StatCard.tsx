import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: Props) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <span className="stat-card-label">{title}</span>
      <strong className="stat-card-value">{value}</strong>
    </motion.div>
  );
}

export default StatCard;