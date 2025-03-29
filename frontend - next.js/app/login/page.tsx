"use client";

import { useLoginMutation } from "@/hooks/mutations/login.mutation";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string()
        .min(5, "Login musi mieć co najmniej 5 znaków")
        .max(20, "Login może mieć maksymalnie 20 znaków")
        .required("Login jest wymagany"),
      password: Yup.string()
        .min(8, "Hasło musi mieć co najmniej 8 znaków")
        .required("Hasło jest wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        await loginMutation.mutateAsync(values);
        queryClient.setQueryData(["isAuthorized"], true);
        toast.success("Logowanie zakończone sukcesem!");
        router.push("/");
      } catch (error) {
        toast.error("Logowanie nie powiodło się. Spróbuj ponownie.");
        console.error(error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white/70 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center mb-6">Logowanie</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              placeholder=""
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
              placeholder=""
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
