import { axiosInstance } from "@/interceptor";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useIsAuthorizedQuery = () => {
  const getIsAuthorized = async (): Promise<any> => {
    try {
      await axiosInstance.get("/auth/is-authorized");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
    }
  };

  return useQuery({
    queryKey: ["isAuthorized"],
    queryFn: getIsAuthorized,
  });
};
