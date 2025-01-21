import React from "react";
import { Link, Navigate } from "react-router";
import Footer from "./Footer";
import useAuth from "../context/useAuth";
import DynamicHead from "./DynamicHead";

interface LayoutAuthProps {
  children: React.ReactNode;
  title: string;
}

export default function LayoutAuth({ children, title }: LayoutAuthProps) {
  const { user } = useAuth();

  // if (loading) return <div>loading</div>;

  if (user) return <Navigate to="/" />;

  return (
    <>
      <DynamicHead />
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-auto shadow-none sm:shadow-lg rounded-lg p-8">
          <h1>{title}</h1>

          {children}

          <div className="mt-6">
            {title === "Login" && (
              <p>
                Belum punya akun?{" "}
                <Link to="/register" className="font-medium text-blue-500">
                  Register
                </Link>
              </p>
            )}
            {title === "Register" && (
              <p>
                Sudah punya akun?{" "}
                <Link to="/login" className="font-medium text-blue-500">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
