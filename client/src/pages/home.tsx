import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost, Category } from "@shared/schema";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Server, Database, Code, Monitor, Cpu, Shield } from "lucide-react";

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 1000 * 60 * 10,
  });

  const featuredPosts = posts?.slice(0, 3) || [];

  // Filter posts based on category and search
  const filteredPosts = posts?.filter((post) => {
    const matchesCategory = !selectedCategory || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Dev Deep Dive</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Exploring the depths of system design, databases, programming languages, and everything in between. 
            A developer's journey through modern technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3" 
              data-testid="read-posts-button"
            >
              Read Latest Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/about">
              <Button 
                variant="outline" 
                className="inline-flex items-center px-6 py-3"
                data-testid="about-button"
              >
                About Me
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest Posts</h2>
            <p className="text-gray-600 dark:text-gray-300">Fresh insights from the world of technology</p>
          </div>

          {postsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  data-testid={`featured-post-${post.slug}`}
                >
                  {post.featuredImage && (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-xl" 
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.publishedAt || new Date()).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        <a>{post.title}</a>
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.description}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                        Read more →
                      </a>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No posts available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              onClick={() => document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3" 
              data-testid="view-all-posts"
            >
              View All Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h2>
            <p className="text-gray-600 dark:text-gray-300">Find content by topic</p>
          </div>

          {categoriesLoading ? (
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
                  <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow group" data-testid={`category-${category.slug}`}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === category.name ? "" : category.name);
                      document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
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

      {/* All Posts Section */}
      <section id="posts-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">All Posts</h2>
            
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory("")}
                  className="text-sm"
                  data-testid="filter-all"
                >
                  All Posts
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                    className="text-sm"
                    data-testid={`filter-${category.slug}`}
                  >
                    {category.name} ({category.postCount})
                  </Button>
                ))}
              </div>
              
              <div className="relative w-full lg:w-80">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10"
                  data-testid="blog-search-input"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="space-y-8">
            {postsLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="animate-pulse md:flex">
                      <div className="md:w-80 md:flex-shrink-0">
                        <div className="w-full h-48 md:h-full bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="p-6 md:p-8 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300" data-testid="no-posts-found">
                  {searchQuery || selectedCategory
                    ? "No posts found matching your criteria."
                    : "No posts available yet."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
