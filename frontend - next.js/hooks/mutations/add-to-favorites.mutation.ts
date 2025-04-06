import axiosInstance from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  const addToFavorites = async (photoId: string): Promise<Photo> => {
    const response = await axiosInstance.post(
      `/photos/${photoId}/add-to-favourites`
    );
    return response.data;
  };

  return useMutation({
    mutationFn: addToFavorites,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to add to favorites"
        );
      }
      throw new Error("An unexpected error occurred");
    },
    onSuccess: (updatedPhoto, photoId) => {
      queryClient.setQueryData(["photo-details", photoId], (oldData: Photo) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          likesCount: oldData.likesCount + 1,
        };
      });

      queryClient.setQueryData(
        ["user-favorites-photos"],
        (oldFavorites: Photo[] | undefined) => {
          if (!oldFavorites) return [updatedPhoto];

          return [...oldFavorites, updatedPhoto];
        }
      );
    },
  });
};
