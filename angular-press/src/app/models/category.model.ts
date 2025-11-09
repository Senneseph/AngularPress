export interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  count: number;
}