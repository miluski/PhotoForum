import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/interceptor";
import axios from "axios";
import { RegisterData } from "@/interfaces/auth";

const register = async (data: RegisterData): Promise<any> => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};
