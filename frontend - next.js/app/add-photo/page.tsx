"use client";

import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { unauthorized } from "next/navigation";
import { CloudDownload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/interceptor";
import { useUploadPhotoMutation } from "@/hooks/mutations/upload-photo.mutation";

export default function AddPhotoPage() {
  const { data: isAuthorized } = useIsAuthorizedQuery();

  if (isAuthorized === false) {
    unauthorized();
  }

  const uploadPhotoMutation = useUploadPhotoMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result?.toString();
        if (!base64Image) {
          throw new Error("Failed to read the file.");
        }

        const payload = {
          path: base64Image,
        };

        await uploadPhotoMutation.mutateAsync(payload);

        toast.success("Zdjęcie zostało dodane pomyślnie!");

        setSelectedFile(null);
        setPreview(null);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the photo."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Dodawanie zdjęcia
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Wybierz lub upuść zdjęcie aby automatycznie dodać je do forum!
        </p>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center flex flex-col items-center justify-center h-48 md:h-64"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="object-contain h-full w-full"
              width={200}
              height={200}
            />
          ) : (
            <>
              <CloudDownload className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm md:text-base">
                Upuść zdjęcie lub kliknij tutaj
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-blue-500 underline mt-2"
          >
            Wybierz plik
          </label>
        </div>

        <button
          className="mt-6 w-full bg-gray-800 text-white py-2 md:py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? "Wgrywanie..." : "Dodaj zdjęcie do forum"}
        </button>
      </div>
    </div>
  );
}
