import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/interceptor";
import axios from "axios";
import { UploadPhoto } from "@/interfaces/photo";

const addPhoto = async (data: UploadPhoto): Promise<void> => {
  try {
    const response = await axiosInstance.post("/photos/new", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Upload failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useUploadPhotoMutation = () => {
  return useMutation({
    mutationFn: addPhoto,
  });
};
