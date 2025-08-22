import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { CategoryBadge } from "./category-badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
  onClick?: () => void;
}

export function BlogCard({ post, compact = false, onClick }: BlogCardProps) {
  const formattedDate = format(new Date(post.publishedAt || new Date()), "MMMM d, yyyy");

  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`}>
        <a 
          className="block bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          onClick={onClick}
          data-testid={`blog-card-compact-${post.slug}`}
        >
          <div className="flex items-start gap-3">
            <CategoryBadge category={post.category} />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex" data-testid={`blog-card-${post.slug}`}>
        {post.featuredImage && (
          <div className="md:w-80 md:flex-shrink-0">
            <img 
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge category={post.category} />
            <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Link href={`/blog/${post.slug}`}>
              <a data-testid={`blog-title-${post.slug}`}>{post.title}</a>
            </Link>
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                  data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`}>
              <a 
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                data-testid={`read-more-${post.slug}`}
              >
                Read more →
              </a>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
