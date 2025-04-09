interface CategorySelectorProps {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  getCategoryPostCount: (category: string) => number;
}

export default function CategorySelector({
  categories,
  currentCategory,
  onCategoryChange,
  getCategoryPostCount,
}: CategorySelectorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap justify-center max-w-4xl">
        <button
          onClick={() => onCategoryChange("all")}
          className={`mx-1 mb-2 px-4 py-1 rounded-full text-sm ${
            currentCategory === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All view ({getCategoryPostCount("all")})
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`mx-1 mb-2 px-4 py-1 rounded-full text-sm ${
              currentCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category} ({getCategoryPostCount(category)})
          </button>
        ))}
      </div>
    </div>
  );
}
