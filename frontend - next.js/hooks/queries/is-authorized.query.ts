import { axiosInstance } from "@/interceptor";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useIsAuthorizedQuery = () => {
  const getIsAuthorized = async (): Promise<boolean> => {
    try {
      await axiosInstance.get("/auth/is-authorized");
      return true;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 401)
      ) {
        return false;
      }
      throw error;
    }
  };

  return useQuery({
    queryKey: ["isAuthorized"],
    queryFn: getIsAuthorized,
    retry: false,
  });
};
