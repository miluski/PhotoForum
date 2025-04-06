import { axiosInstance } from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useQuery } from "@tanstack/react-query";

export const useGetPhotoByIdQuery = (photoId: string) => {
  const getPhotoByPath = async (): Promise<Photo> => {
    try {
      const response = await axiosInstance.get(`/photos/public/id/${photoId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["photo-details", photoId],
    queryFn: getPhotoByPath,
    enabled: !!photoId,
  });
};
