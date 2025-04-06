import axiosInstance from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  const toggleFavorite = async (photoId: string): Promise<Photo> => {
    const favorites: Photo[] | undefined = queryClient.getQueryData([
      "user-favorites-photos",
    ]);
    const isFavorite = favorites?.some((photo) => photo.id == photoId);

    if (isFavorite) {
      // Remove from favorites
      const response = await axiosInstance.delete(
        `/photos/${photoId}/remove-from-favourites`
      );
      return response.data;
    } else {
      // Add to favorites
      const response = await axiosInstance.post(
        `/photos/${photoId}/add-to-favourites`
      );
      return response.data;
    }
  };

  return useMutation({
    mutationFn: toggleFavorite,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to toggle favorite status"
        );
      }
      throw new Error("An unexpected error occurred");
    },
    onSuccess: (updatedPhoto, photoId) => {
      // Update the "photo-details" cache
      queryClient.setQueryData(["photo-details", photoId], (oldData: Photo) => {
        if (!oldData) return oldData;

        const favorites = queryClient.getQueryData<Photo[]>([
          "user-favorites-photos",
        ]);
        const isFavorite = favorites?.some((photo) => photo.id == photoId);

        return {
          ...oldData,
          likesCount: isFavorite
            ? oldData.likesCount - 1
            : oldData.likesCount + 1,
        };
      });

      // Update the "user-favorites-photos" cache
      queryClient.setQueryData(
        ["user-favorites-photos"],
        (oldFavorites: Photo[] | undefined) => {
          if (!oldFavorites) return [updatedPhoto];

          const isFavorite = oldFavorites.some((photo) => photo.id == photoId);

          // if (isFavorite) {
          //   // Remove the photo from favorites
          //   return oldFavorites.filter((photo) => photo.id != photoId);
          // } else {
          //   // Add the photo to favorites
          //   return [...oldFavorites, updatedPhoto];
          // }

          queryClient.refetchQueries({
            queryKey: ["user-favorites-photos"],
          });
        }
      );
    },
  });
};
