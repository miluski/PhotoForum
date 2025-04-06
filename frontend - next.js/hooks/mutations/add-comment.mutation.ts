import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/interceptor";
import axios from "axios";

const addComment = async ({
  photoId,
  comment,
}: {
  photoId: string;
  comment: string;
}): Promise<void> => {
  try {
    const response = await axiosInstance.post(
      `/photos/${photoId}/add-comment`,
      { comment }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (data, variables) => {
      const { photoId, comment } = variables;

      queryClient.setQueryData(["photo-details", photoId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          commentDtos: [
            ...oldData.commentDtos,
            { content: comment, createdAt: new Date().toISOString() },
          ],
        };
      });
    },
  });
};
