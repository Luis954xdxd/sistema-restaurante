import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
}

function PageHeader({ title, subtitle }: Props) {
  return (
    <motion.div
      className="page-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </motion.div>
  );
}

export default PageHeader;