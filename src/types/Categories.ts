export interface CategoryType {
  id: number;
  category_id: number;
  category_type: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryService {
  id: number;
  name_ar: string;
  name_en: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  service_type: number;
  category: Category;
  [key: `name_${string}`]: string | undefined;
}

export interface CategoryImage {
  id: number;
  title: string;
  alt: string;
  caption: string;
  url: string;
  imageable_id: number;
  imageable_type: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name_ar: string;
  name_en: string;
  created_at: string;
  updated_at: string;
  alias: string;
  has_ideas: number;
  children: Category[];
  types: CategoryType[];
  services: CategoryService[] | null;
  images: CategoryImage[];
  [key: `name_${string}`]: string | undefined;
}
