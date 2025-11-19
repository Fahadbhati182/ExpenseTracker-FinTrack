import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Menu, X } from "lucide-react";

export function TopNavbar() {
  const path = window.location.pathname;
  const [toShow, setToShow] = useState(path);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, getUserDetails, isUser, logoutUser } = useApp()

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <header className="
      flex items-center justify-between
      border-b border-[#203227]
      px-4 sm:px-6 py-4 
      bg-[#0b120d] text-white
      relative
    ">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer"
      >
        <img className="w-10 h-10" src="/fintrack.png" alt="" />
        <h1 className="text-xl sm:text-2xl font-bold">FinTrack</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-8 text-sm">
        {[{ title: "Dashboard", link: "/" }, { title: "All Expenses", link: "/expenses" }].map(
          (item) => (
            <NavLink
              key={item.link}
              onClick={() => setToShow(item.link)}
              to={item.link}
              className={`${toShow === item.link
                ? "text-[#4de17b] font-medium"
                : "text-[#9db9a6] hover:text-white"
                }`}
            >
              {item.title}
            </NavLink>
          )
        )}
      </nav>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Button
          onClick={() => navigate("/add-expense")}
          className="bg-[#4de17b] text-black hover:bg-[#3ccd6a] font-semibold px-6"
        >
          Add New Expense
        </Button>

        {user && (
          <Button
            onClick={logoutUser}
            variant="ghost"
            className="text-[#9db9a6]  cursor-pointer"
          >
            Logout
          </Button>
        )}

        {isUser && (
          <div
            className="w-10 h-10 bg-cover bg-center rounded-full"
            style={{ backgroundImage: `url('${user?.img}')` }}
          />
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div
          className="
            absolute top-full left-0 w-full
            bg-[#0d1711]
            border-b border-[#203227]
            flex flex-col gap-4 p-6 z-50
            md:hidden
          "
        >
          {/* Nav Items */}
          <nav className="flex flex-col gap-4 text-base">
            {[{ title: "Dashboard", link: "/" }, { title: "All Expenses", link: "/expenses" }].map(
              (item) => (
                <NavLink
                  key={item.link}
                  onClick={() => {
                    setToShow(item.link);
                    setMobileOpen(false);
                  }}
                  to={item.link}
                  className={`${toShow === item.link
                    ? "text-[#4de17b] font-medium"
                    : "text-[#9db9a6] hover:text-white"
                    }`}
                >
                  {item.title}
                </NavLink>
              )
            )}
          </nav>

          {/* Buttons */}
          <Button
            onClick={() => {
              navigate("/add-expense");
              setMobileOpen(false);
            }}
            className="bg-[#4de17b] text-black hover:bg-[#3ccd6a] font-semibold"
          >
            Add New Expense
          </Button>

          {user && (
            <Button
              onClick={() => {
                logoutUser();
                setMobileOpen(false);
              }}
              variant="ghost"
              className="text-[#9db9a6]"
            >
              Logout
            </Button>
          )}

          {isUser && (
            <div
              className="w-14 h-14 bg-cover bg-center rounded-full"
              style={{ backgroundImage: `url('${user?.img}')` }}
            />
          )}
        </div>
      )}
    </header>
  );
}
