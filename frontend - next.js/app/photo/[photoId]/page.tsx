"use client";

import { useGetPhotoByIdQuery } from "@/hooks/queries/get-photo-by-id.query";
import { unauthorized, useParams } from "next/navigation";
import { Heart, MessageCircle, Send } from "lucide-react";
import { BASE_IMAGE_URL } from "@/consts";
import { useAddCommentMutation } from "@/hooks/mutations/add-comment.mutation";
import { useToggleFavoriteMutation } from "@/hooks/mutations/toggle-favorite.mutation";
import { useGetUserFavoritesPhotosQuery } from "@/hooks/queries/get-user-favorites-photos.query";
import { useState } from "react";
import { Comment } from "@/interfaces/comment";
import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";

const defaultAvatarUrl =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function PhotoPage() {
  const { photoId }: { photoId: string } = useParams();
  const { data: photo } = useGetPhotoByIdQuery(photoId as string);
  const addCommentMutation = useAddCommentMutation();
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const { data: userFavoritesPhotos } = useGetUserFavoritesPhotosQuery();
  const { data: isAuthorized } = useIsAuthorizedQuery();

  const [comment, setComment] = useState("");

  if (isAuthorized === false) {
    unauthorized();
  }

  if (!photo) {
    return <div className="text-center text-gray-500 mt-10 min-h-[100vh]" />;
  }

  const avatarUrl =
    photo.userDto?.avatarPath && photo.userDto.avatarPath !== "null"
      ? `${BASE_IMAGE_URL}${photo.userDto.avatarPath}`
          .replace("/media", "")
          .replace(/([^:])\/{2,}/g, "$1/")
      : defaultAvatarUrl;

  const isFavorite = userFavoritesPhotos?.some(
    (favPhoto) => favPhoto.id == photoId
  );

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        await addCommentMutation.mutateAsync({ photoId, comment });
        setComment(""); // Clear the input after successful comment
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavoriteMutation.mutateAsync(photoId);
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-32 min-h-screen">
      {/* Photo Section */}
      <div className="w-full max-w-4xl mx-auto">
        <img
          src={`${BASE_IMAGE_URL}${photo.path}`}
          alt={`Photo by ${photo.userDto?.surname}`}
          className="w-full h-auto rounded-t-lg shadow-md object-cover max-h-[600px]"
        />
      </div>

      {/* User Info and Stats Section */}
      <div className="w-full max-w-4xl mx-auto bg-[#F9DE98] rounded-b-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt={`Avatar of ${photo.userDto?.surname}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-lg font-medium text-gray-800">
              {photo.userDto?.name} {photo.userDto?.surname}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart
                className={`w-5 h-5 cursor-pointer ${
                  isFavorite ? "text-red-500" : "text-gray-500"
                }`}
                onClick={handleToggleFavorite}
              />
              <span className="text-sm text-gray-600">{photo.likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {photo.commentDtos.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full max-w-4xl mx-auto">
        {photo.commentDtos.length > 0 ? (
          photo.commentDtos.map((comment: Comment, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start space-x-3"
            >
              <img
                src={avatarUrl}
                alt={`Avatar of ${photo.userDto?.surname}`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {photo.userDto?.name} {photo.userDto?.surname}
                  </span>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            Brak komentarzy. Napisz pierwszy!
          </div>
        )}
        {/* Comment Input */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex items-center space-x-3">
          <img
            src={avatarUrl}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napisz komentarz..."
            className="flex-1 p-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Send className="cursor-pointer" onClick={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
