import { axiosInstance } from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useQuery } from "@tanstack/react-query";

export const useGetFavoritePhotosQuery = () => {
  const getFavoritePhotos = async (): Promise<Photo[]> => {
    try {
      const response = await axiosInstance.get("/users/get-favourite-photos");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["favorite-photos"],
    queryFn: getFavoritePhotos,
  });
};
