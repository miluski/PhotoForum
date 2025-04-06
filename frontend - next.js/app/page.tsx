"use client";

import { BASE_IMAGE_URL } from "@/consts";
import { useGetAllPhotosQuery } from "@/hooks/queries/get-all-photos.query";
import { useGetFavoritePhotosQuery } from "@/hooks/queries/get-favorites-photos.query";
import { Photo } from "@/interfaces/photo";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { useSearch } from "@/components/search-provider";

const defaultAvatarUrl =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function Home() {
  const { data: allPhotos } = useGetAllPhotosQuery();
  const { data: favoritePhotos } = useGetFavoritePhotosQuery();
  const { data: isAuthorized } = useIsAuthorizedQuery();
  const { searchQuery } = useSearch();

  const filterPhotos = (photos: Photo[] | undefined) => {
    if (!photos) return [];
    if (!searchQuery.trim()) return photos;

    return photos.filter((photo) => {
      const { name, surname, login } = photo.userDto;
      const query = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(query) ||
        surname.toLowerCase().includes(query) ||
        login.toLowerCase().includes(query)
      );
    });
  };

  const renderPhotos = (photos: Photo[] | undefined) => {
    const filteredPhotos = filterPhotos(photos);

    return filteredPhotos.map((photo: Photo) => {
      const avatarUrl =
        photo.userDto?.avatarPath && photo.userDto.avatarPath !== "null"
          ? `${BASE_IMAGE_URL}${photo.userDto.avatarPath}`
              .replace("/media", "") // Remove "/media" from avatarPath
              .replace(/([^:])\/{2,}/g, "$1/") // Remove double slashes
          : defaultAvatarUrl;

      return (
        <Link key={photo.id} href={`/photo/${photo.id}`}>
          <div className="bg-[#F9DE98] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
              src={`${BASE_IMAGE_URL}${photo.path}`}
              alt={`Photo by ${photo.userDto?.surname}`}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="p-3">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <img
                    src={avatarUrl}
                    alt={`Photo by ${photo.userDto?.surname}`}
                    className="w-8 h-8 rounded-full object-cover aspect-square"
                  />
                  <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                    {photo.userDto?.name} {photo.userDto?.surname}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {photo.likesCount}
                    </span>
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
          </div>
        </Link>
      );
    });
  };

  return (
    <main className="container mx-auto p-4 mt-24 md:mt-48 min-h-screen">
      <TabGroup>
        <TabList className="flex space-x-4 pb-2 mb-4">
          <Tab
            className={({ selected }) =>
              `px-4 py-2 text-sm font-medium cursor-pointer outline-none ${
                selected
                  ? "text-yellow-600 border-b-2 border-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            Wszystkie
          </Tab>
          {isAuthorized && (
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium cursor-pointer outline-none ${
                  selected
                    ? "text-yellow-600 border-b-2 border-yellow-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Ulubione
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderPhotos(allPhotos)}
            </div>
          </TabPanel>
          {isAuthorized && (
            <TabPanel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderPhotos(favoritePhotos)}
              </div>
            </TabPanel>
          )}
        </TabPanels>
      </TabGroup>
    </main>
  );
}
