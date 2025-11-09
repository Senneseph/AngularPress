export interface Post {
  id?: number;
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'publish' | 'private' | 'pending';
  type: 'post' | 'page' | 'custom';
  authorId: number;
  dateCreated: Date;
  dateModified: Date;
  slug?: string;
  featuredImage?: string;
  categories?: number[];
  tags?: string[];
  meta?: { [key: string]: any };
}