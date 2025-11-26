export interface Media {
  _id: string;
  url: string;
  publicId: string;
  uploadedBy: string;
  business: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaResponse {
  data: {
    results: Media[];
  };
}

export interface CreateMediaResponse {
  data: Media;
}
