import { axiosInstance } from "@/interceptor";
import { User } from "@/interfaces/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUserDetailsQuery = () => {
  const getUserDetails = async (): Promise<User> => {
    try {
      const response = await axiosInstance.get("/users/user-details");

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["user-details"],
    queryFn: getUserDetails,
  });
};
