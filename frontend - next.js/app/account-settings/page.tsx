"use client";

import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { unauthorized } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useGetUserDetailsQuery } from "@/hooks/queries/user-details.query";
import { useEditUserMutation } from "@/hooks/mutations/edit-user-details.mutation";

export default function AccountSettingsPage() {
  const { data: isAuthorized, isLoading } = useIsAuthorizedQuery();
  const { data: userDetails } = useGetUserDetailsQuery();

  const editUserMutation = useEditUserMutation();

  const [profileImage, setProfileImage] = useState("/");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Imię musi mieć co najmniej 2 znaki")
        .max(50, "Imię może mieć maksymalnie 50 znaków")
        .required("Imię jest wymagane"),
      lastName: Yup.string()
        .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
        .max(50, "Nazwisko może mieć maksymalnie 50 znaków")
        .required("Nazwisko jest wymagane"),
      login: Yup.string()
        .min(5, "Login musi mieć co najmniej 5 znaków")
        .max(20, "Login może mieć maksymalnie 20 znaków")
        .required("Login jest wymagany"),
      password: Yup.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    }),
    onSubmit: async (values) => {
      try {
        const initialValues = {
          firstName: userDetails?.name || "",
          lastName: userDetails?.surname || "",
          login: userDetails?.login || "",
          password: "", // Hasło nie jest przechowywane
          avatarPath: userDetails?.avatarPath
            ? `https://78.88.231.247:4443/api/v1/photos/public${userDetails.avatarPath.replace(
                "/media/",
                "/"
              )}`
            : "/",
        };

        const payload: {
          name?: string;
          surname?: string;
          login?: string;
          password?: string;
          avatarPath?: string;
        } = {};

        if (values.firstName !== initialValues.firstName) {
          payload.name = values.firstName;
        }
        if (values.lastName !== initialValues.lastName) {
          payload.surname = values.lastName;
        }
        if (values.login !== initialValues.login) {
          payload.login = values.login;
        }
        if (values.password) {
          payload.password = values.password;
        }
        if (
          profileImage !== initialValues.avatarPath &&
          !profileImage.startsWith("https://")
        ) {
          payload.avatarPath = profileImage;
        }

        // Check if any changes were made
        if (Object.keys(payload).length > 0) {
          await editUserMutation.mutateAsync(payload);
          toast.success("Zmiany zostały zapisane!");
        } else {
          toast.info("Brak zmian do zapisania.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Nie udało się zapisać zmian. Spróbuj ponownie.";
        toast.error(errorMessage);
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (userDetails) {
      formik.setValues({
        firstName: userDetails.name || "",
        lastName: userDetails.surname || "",
        login: userDetails.login || "",
        password: "", // Leave password empty for security reasons
      });
      if (userDetails.avatarPath) {
        const fullAvatarUrl = `https://78.88.231.247:4443/api/v1/photos/public/${userDetails.avatarPath.replace(
          "/media/",
          "/"
        )}`;
        setProfileImage(fullAvatarUrl);
      }
    }
  }, [userDetails]);

  if (isAuthorized === false) {
    unauthorized();
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          setProfileImage(reader.result.toString());
        }
      };

      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center justify-start mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Zdjęcie profilowe
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                PNG, JPG poniżej 1 MB
              </p>
            </div>
            <img
              src={profileImage}
              alt="Profile Image"
              className="w-14 h-14 rounded-full object-cover aspect-square"
            />
          </div>

          <label
            htmlFor="profileImage"
            className="bg-gray-800 text-white px-3 py-1 rounded-full cursor-pointer shadow-md hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Dodaj zdjęcie</span>
            <input
              id="profileImage"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Imię
            </label>
            <input
              type="text"
              id="firstName"
              {...formik.getFieldProps("firstName")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nazwisko
            </label>
            <input
              type="text"
              id="lastName"
              {...formik.getFieldProps("lastName")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700"
            >
              Login
            </label>
            <input
              type="text"
              id="login"
              {...formik.getFieldProps("login")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.login && formik.errors.login
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.login && formik.errors.login ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.login}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
