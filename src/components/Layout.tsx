import { Link } from "react-router";
import Logo from "./Logo";
import Footer from "./Footer";
import { account } from "../config";
import useAuth from "../context/useAuth";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import { PiSpinner } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import Loading from "./Loading";
import DynamicHead from "./DynamicHead";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [pendingLogout, setPendingLogout] = useState(false);

  if (loading) return <Loading />;

  const onLogout = async () => {
    setPendingLogout(true);
    try {
      await account.deleteSession("current");
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setPendingLogout(false);
    }
  };

  return (
    <>
      <DynamicHead />
      <div className="flex flex-col min-h-screen">
        <header className="h-16 border-b bg-white sticky top-0 z-50">
          <div className="container flex h-full items-center justify-between">
            <Logo />
            <nav className="flex gap-6 items-center">
              {user && (
                <div className="group relative z-50">
                  <button type="button" onClick={onLogout} className="flex items-center">
                    {/* <span>Halo, {user.name}</span> */}
                    <FaRegUserCircle size={24} />
                    <FaChevronDown size={10} className="ml-2 group-hover:rotate-180 transition" />
                  </button>
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition absolute pt-2 right-0 top-full min-w-full">
                    <div className="flex flex-col bg-white border p-2 w-full space-y-2">
                      <div className="min-w-max">Halo, {user.name}</div>
                      <button type="button" onClick={onLogout} className="btn flex justify-center w-full">
                        {pendingLogout ? <PiSpinner size={24} className="animate-spin" /> : "Logout"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!user && (
                <>
                  <Link to="/login" className="text-blue-500 font-semibold">
                    Login
                  </Link>
                  <Link to="/register" className="btn">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="grow container">{children}</main>
        <Footer />
      </div>
    </>
  );
}
