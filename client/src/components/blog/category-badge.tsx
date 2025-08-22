import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryColors: Record<string, string> = {
  "system design": "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300",
  "databases": "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300", 
  "languages": "bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300",
  "frontend": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300",
  "backend": "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300",
  "devops": "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300",
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colorClass = categoryColors[category.toLowerCase()] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  
  return (
    <span 
      className={cn("px-3 py-1 rounded-full text-sm font-medium", colorClass, className)}
      data-testid={`category-badge-${category.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {category}
    </span>
  );
}
