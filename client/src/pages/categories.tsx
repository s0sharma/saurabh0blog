import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Server, 
  Database, 
  Code, 
  Monitor, 
  Cpu, 
  Shield 
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "system-design": <Server className="w-6 h-6" />,
  "databases": <Database className="w-6 h-6" />,
  "languages": <Code className="w-6 h-6" />,
  "frontend": <Monitor className="w-6 h-6" />,
  "backend": <Cpu className="w-6 h-6" />,
  "devops": <Shield className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  "system-design": "blue",
  "databases": "green",
  "languages": "purple",
  "frontend": "yellow",
  "backend": "red",
  "devops": "indigo",
};

export default function Categories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 1000 * 60 * 10,
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <p className="text-gray-600 dark:text-gray-300">Explore posts by topic</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const color = categoryColors[category.slug] || "gray";
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30",
                green: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-500/30",
                purple: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30",
                yellow: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-500/30",
                red: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-500/30",
                indigo: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30",
                gray: "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-500/30",
              }[color];

              return (
                <Link key={category.id} href={`/blog?category=${category.slug}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow group" data-testid={`category-${category.slug}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${colorClasses}`}>
                          {categoryIcons[category.slug] || <Code className="w-6 h-6" />}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category.postCount} posts
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {category.description}
                      </p>
                      <span className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                        View posts →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No categories available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
