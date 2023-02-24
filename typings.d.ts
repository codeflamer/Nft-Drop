export interface Image {
  asset: {
    url: string;
  };
}

export interface Creator {
  _id: string;
  name: string;
  address: string;
  slug: {
    currency: string;
  };
  image: string;
  bio: string;
}

export interface Collection {
  _id: string;
  title: string;
  description: string;
  nftCollectionName: string;
  mainImage: Image;
  previewImage: Image;
  slug: {
    current: string;
  };
  creator: Creator;
  address: string;
}
