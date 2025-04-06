import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/interceptor";
import axios from "axios";
import { EditUser } from "@/interfaces/user";

const editUser = async (data: EditUser): Promise<void> => {
  try {
    const response = await axiosInstance.patch("/users/edit", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Edit failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useEditUserMutation = () => {
  return useMutation({
    mutationFn: editUser,
  });
};
