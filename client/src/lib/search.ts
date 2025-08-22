import Fuse from "fuse.js";
import { BlogPost } from "@shared/schema";

const searchOptions = {
  keys: ["title", "description", "content", "tags"],
  threshold: 0.3,
  includeScore: true,
};

export function createSearchIndex(posts: BlogPost[]) {
  return new Fuse(posts, searchOptions);
}

export function searchPosts(posts: BlogPost[], query: string) {
  const fuse = createSearchIndex(posts);
  const results = fuse.search(query);
  return results.map((result: any) => result.item);
}
