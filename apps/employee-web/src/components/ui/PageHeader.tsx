// Importamos motion para animación
import { motion } from 'framer-motion';

// Props del header
interface Props {
  title: string;
  subtitle?: string;
}

// Header reutilizable
function PageHeader({ title, subtitle }: Props) {
  return (
    <motion.div
      className="employee-page-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </motion.div>
  );
}

export default PageHeader;