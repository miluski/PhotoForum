import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/interceptor";
import axios from "axios";
import { LoginData } from "@/interfaces/auth";

const login = async (data: LoginData): Promise<any> => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
