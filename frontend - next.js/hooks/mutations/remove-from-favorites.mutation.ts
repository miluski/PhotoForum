import axiosInstance from "@/interceptor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRemoveFromFavoritesMutation = () => {
  const removeFromFavorites = async (photoId: string): Promise<void> => {
    const response = await axiosInstance.delete(
      `/photos/${photoId}/remove-from-favourites`
    );
    return response.data;
  };

  return useMutation({
    mutationFn: removeFromFavorites,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to remove from favorites"
        );
      }
      throw new Error("An unexpected error occurred");
    },
  });
};
