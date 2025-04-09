export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  categories?: string[];
  excerpt?: string;
  thumbnail?: string;
}
