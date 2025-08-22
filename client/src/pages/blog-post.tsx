import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { CategoryBadge } from "@/components/blog/category-badge";
import { MDXContent } from "@/components/blog/mdx-content";
import { NotesSidebar } from "@/components/notes/notes-sidebar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronRight, Twitter, Link2, StickyNote } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/posts", params?.slug],
    enabled: !!params?.slug,
    staleTime: 1000 * 60 * 10,
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
    staleTime: 1000 * 60 * 5,
  });

  // Process MDX content
  useEffect(() => {
    if (post?.content) {
      serialize(post.content, {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      }).then(setMdxSource);
    }
  }, [post?.content]);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  if (!match || !params?.slug) {
    return <div>Post not found</div>;
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-96"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button data-testid="back-to-blog">Back to Blog</Button>
          </Link>
        </div>
      </section>
    );
  }

  const formattedDate = format(new Date(post.publishedAt || new Date()), "MMMM d, yyyy");
  
  // Get related posts (same category, exclude current post)
  const relatedPosts = allPosts?.filter(
    p => p.id !== post.id && p.category === post.category
  ).slice(0, 2) || [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title} - ${post.description}`;

  const handleCreateNote = (noteContent: string) => {
    setSelectedText("");
    // Clear selection
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isNotesSidebarOpen ? 'mr-80' : ''}`}>
        {/* Breadcrumb */}
        <nav className="mb-8" data-testid="breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/">
                <a className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              </Link>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li>
              <Link href="/blog">
                <a className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a>
              </Link>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 dark:text-gray-100 truncate">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CategoryBadge category={post.category} />
            <span className="text-gray-500 dark:text-gray-400">{formattedDate}</span>
            <span className="text-gray-500 dark:text-gray-400">{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.description}
          </p>

          {/* Featured Image */}
          {post.featuredImage && (
            <img 
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-80 object-cover rounded-xl mt-8 shadow-lg"
            />
          )}
        </header>

        {/* Notes Toggle Button */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <Button
            onClick={() => setIsNotesSidebarOpen(!isNotesSidebarOpen)}
            className="rounded-full p-3 shadow-lg"
            data-testid="toggle-notes-sidebar"
          >
            <StickyNote className="w-5 h-5" />
          </Button>
          {selectedText && !isNotesSidebarOpen && (
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Article Content */}
        <article className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            {selectedText && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✓ Selected: "{selectedText}" 
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setIsNotesSidebarOpen(true)}
                    className="ml-2 text-blue-600 dark:text-blue-400"
                    data-testid="open-notes-from-selection"
                  >
                    Add note
                  </Button>
                </p>
              </div>
            )}
            
            <div className="select-text">
              {mdxSource ? (
                <MDXContent source={mdxSource} />
              ) : (
                <div className="prose prose-lg dark:prose-invert prose-blue max-w-none">
                  <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {post.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Tags and Social Share */}
        <div className="mb-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    data-testid={`post-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Share:</h4>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                  data-testid="share-twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                  data-testid="share-linkedin"
                >
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Posts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  data-testid={`related-post-${relatedPost.slug}`}
                >
                  <CategoryBadge category={relatedPost.category} />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <a>{relatedPost.title}</a>
                    </Link>
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {relatedPost.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>

      {/* Notes Sidebar */}
      <NotesSidebar
        postId={post?.id || ""}
        isOpen={isNotesSidebarOpen}
        onClose={() => setIsNotesSidebarOpen(false)}
        selectedText={selectedText}
        onCreateNote={handleCreateNote}
      />
    </>
  );
}
