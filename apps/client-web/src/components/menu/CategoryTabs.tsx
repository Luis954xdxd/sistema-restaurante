// Tipo local de categoría resumida
interface CategoryOption {
  id: number;
  name: string;
}

// Props del componente
interface Props {
  categories: CategoryOption[];
  activeCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

// Tabs por categoría
function CategoryTabs({
  categories,
  activeCategoryId,
  onSelectCategory,
}: Props) {
  return (
    <div className="client-category-tabs">
      <button
        type="button"
        className={activeCategoryId === null ? 'client-category-tab active' : 'client-category-tab'}
        onClick={() => onSelectCategory(null)}
      >
        Todo
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={
            activeCategoryId === category.id
              ? 'client-category-tab active'
              : 'client-category-tab'
          }
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;