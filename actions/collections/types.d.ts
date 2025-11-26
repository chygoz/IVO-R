export interface Collection {
  _id: string;
  name: string;
  business: string;
  slug: string;
  description: string;
  products: [];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionResponse {
  data: {
    results: Collection[];
  };
}

export interface CreationCollectionResponse {
  data: Collection;
}
