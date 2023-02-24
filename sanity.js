import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: process.env.NODE_ENV === "production", // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
  //token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
};

export const sanityClient = createClient(config);

export const urlFor = (source) => imageUrlBuilder(config).image(source);
