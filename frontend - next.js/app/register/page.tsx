"use client";

import { useRegisterMutation } from "@/hooks/mutations/register.mutation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      name: "",
      surname: "",
    },
    validationSchema: Yup.object({
      login: Yup.string()
        .min(5, "Login musi mieć co najmniej 5 znaków")
        .max(20, "Login może mieć maksymalnie 20 znaków")
        .required("Login jest wymagany"),
      password: Yup.string()
        .min(8, "Hasło musi mieć co najmniej 8 znaków")
        .matches(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
        .matches(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
        .matches(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
        .matches(
          /[@$!%*?&#]/,
          "Hasło musi zawierać co najmniej jeden znak specjalny"
        )
        .required("Hasło jest wymagane"),
      name: Yup.string()
        .min(3, "Imię musi mieć co najmniej 3 znaki")
        .max(50, "Imię może mieć maksymalnie 50 znaków")
        .required("Imię jest wymagane"),
      surname: Yup.string()
        .min(5, "Nazwisko musi mieć co najmniej 5 znaków")
        .max(60, "Nazwisko może mieć maksymalnie 60 znaków")
        .required("Nazwisko jest wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        await registerMutation.mutateAsync(values);
        toast.success("Rejestracja zakończona sukcesem!");
      } catch (error) {
        toast.error("Rejestracja nie powiodła się. Spróbuj ponownie.");
        console.error(error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white/70 bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center mb-6">Rejestracja</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Imię
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps("name")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
              placeholder=""
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="surname"
              className="block text-sm font-medium text-gray-700"
            >
              Nazwisko
            </label>
            <input
              type="text"
              id="surname"
              {...formik.getFieldProps("surname")}
              className={`mt-1 block w-full px-3 py-2 border ${
                formik.touched.surname && formik.errors.surname
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
              placeholder=""
            />
            <div className="mt-1 min-h-[20px]">
              {formik.touched.surname && formik.errors.surname ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.surname}
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
              Zarejestruj się
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
