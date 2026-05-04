import axios from "axios";
import type { Photo } from "../types/photo";

axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] = import.meta.env.VITE_API_KEY;
axios.defaults.params = {
  orientation: "landscape",
};

export const getPhotos = async (query: string): Promise<Photo[]> => {
  const response = await axios.get<{ photos: Photo[] }>(
    `search?query=${query}`,
  );

  return response.data.photos;
};
