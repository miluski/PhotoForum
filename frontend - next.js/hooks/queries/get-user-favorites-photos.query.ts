import axiosInstance from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useQuery } from "@tanstack/react-query";

export const useGetUserFavoritesPhotosQuery = () => {
  const getUserFavoritesPhotos = async (): Promise<Photo[]> => {
    try {
      const response = await axiosInstance.get("/users/get-favourite-photos");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["user-favorites-photos"],
    queryFn: getUserFavoritesPhotos,
  });
};
