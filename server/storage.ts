import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type Category, type InsertCategory, type Note, type InsertNote } from "@shared/schema";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog post methods
  getAllPosts(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPostsByCategory(category: string): Promise<BlogPost[]>;
  searchPosts(query: string): Promise<BlogPost[]>;
  createPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Note methods
  getNotesByPostId(postId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, BlogPost>;
  private categories: Map<string, Category>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.categories = new Map();
    this.notes = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const defaultCategories = [
      {
        name: "System Design",
        slug: "system-design",
        description: "Architecture patterns, scalability, and distributed systems",
        color: "blue",
        postCount: "1"
      },
      {
        name: "Databases",
        slug: "databases", 
        description: "SQL, NoSQL, optimization, and data modeling",
        color: "green",
        postCount: "1"
      },
      {
        name: "Languages",
        slug: "languages",
        description: "TypeScript, JavaScript, Python, and language comparisons",
        color: "purple", 
        postCount: "1"
      },
      {
        name: "Frontend",
        slug: "frontend",
        description: "React, Next.js, UI/UX, and frontend best practices",
        color: "yellow",
        postCount: "0"
      },
      {
        name: "Backend",
        slug: "backend",
        description: "APIs, microservices, performance, and server-side development", 
        color: "red",
        postCount: "0"
      },
      {
        name: "DevOps",
        slug: "devops",
        description: "CI/CD, containerization, monitoring, and deployment strategies",
        color: "indigo",
        postCount: "0"
      }
    ];

    defaultCategories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, { ...cat, id, postCount: cat.postCount });
    });

    // Load MDX posts from filesystem
    this.loadPostsFromFiles();
  }

  private loadPostsFromFiles() {
    const postsDir = path.join(process.cwd(), "posts");
    
    if (!fs.existsSync(postsDir)) {
      return;
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));
    
    files.forEach(file => {
      try {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const slug = file.replace('.mdx', '');
        const id = randomUUID();
        
        const post: BlogPost = {
          id,
          slug,
          title: data.title || '',
          description: data.description || '',
          content,
          category: data.category || '',
          tags: data.tags || [],
          readTime: data.readTime || '5 min read',
          featuredImage: data.featuredImage || null,
          publishedAt: new Date(data.publishedAt || Date.now())
        };
        
        this.posts.set(id, post);
      } catch (error) {
        console.error(`Error loading post ${file}:`, error);
      }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPosts(): Promise<BlogPost[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
      tags: insertPost.tags || []
    };
    this.posts.set(id, post);
    return post;
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id, postCount: insertCategory.postCount || "0" };
    this.categories.set(id, category);
    return category;
  }

  // Note methods
  async getNotesByPostId(postId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.postId === postId);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      ...insertNote,
      id,
      createdAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async deleteNote(id: string): Promise<void> {
    this.notes.delete(id);
  }
}

export const storage = new MemStorage();
