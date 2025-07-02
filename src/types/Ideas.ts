interface Image {
  id: number;
  title: string;
  alt: string;
  caption: string;
  url: string;
}

export interface Idea {
  created_at: string;
  description_ar: string;
  description_en: string;
  id: number;
  images: Image[];
  title_ar: string;
  title_en: string;
  updated_at: string;
  user_project_id: number | null;
  user_service_id: number;
}

export type Attribute = {
  id: number;
  pivot: any;
  types: any[];
  [key: string]: any;
};

export type ServicePayload = {
  attributes: Attribute[];
};
export type OptionType = {
  name_en: string;
  name_ar: string;
  attributesId: number;
};
export interface ValuesOptionType {
  attributesId: number;
  name_en: string;
  name_ar: string;
  [key: `name_${string}`]: string | undefined;
}

export interface PaginatedResponse<T> {
  payload: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export type IdeasData = PaginatedResponse<Idea>;
