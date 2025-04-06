import { axiosInstance } from "@/interceptor";
import { Photo } from "@/interfaces/photo";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPhotosQuery = () => {
  const getUserDetails = async (): Promise<Photo[]> => {
    try {
      const response = await axiosInstance.get("/photos/posts");

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["all-photos"],
    queryFn: getUserDetails,
  });
};
