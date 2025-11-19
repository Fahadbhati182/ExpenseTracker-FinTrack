import { expenses } from "@/assets/assets";
import type { User } from "@/types/User";
import { createContext, useContext, useState } from "react";

type AppContextType = {
  isUser: boolean,
  user: null | User,
  getItemFromLocalStorage: (key: string) => any,
  saveItemToLocalStorage: (key: string, value: any) => void,
  saveUserDetails: (userDetails: User) => void,
  getUserDetails: () => void,
  logoutUser: () => void,
  userLogin: (email: string, password: string) => void,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState<null | User>(null);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("allUsers");
    return saved ? JSON.parse(saved) : [];
  });

  const getItemFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  const saveItemToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }



  const saveUserDetails = (userDetails: User) => {
    saveItemToLocalStorage("userDetails", userDetails);
    saveItemToLocalStorage("allUsers", allUsers ? [...allUsers, userDetails] : [userDetails]);
    setIsUser(true);
    setAllUsers(allUsers ? [...allUsers, userDetails] : [userDetails]);
    setUser(userDetails);
  }

  const getUserDetails = () => {
    const userDetails = getItemFromLocalStorage("userDetails");
    if (userDetails) {
      setIsUser(true);
      setUser(userDetails);
    }
  }

  const userLogin = (email: string, password: string) => {
    const users: Array<User> = getItemFromLocalStorage("allUsers") || [];
    if (users.length === 0) {
      alert("No users found. Please sign up first.");
      return;
    }
    const existingUser = users.find((user) => user.email === email && user.password === password);
    if (existingUser) {
      setIsUser(true);
      setUser(existingUser);
      saveItemToLocalStorage("userDetails", existingUser);
    } else {
      alert("Invalid email or password");
    }
  }

  const logoutUser = () => {
    localStorage.removeItem("userDetails");
    setIsUser(false);
    setUser(null);
    window.location.reload();
  }




  const value: any = {
    isUser,
    user,
    getItemFromLocalStorage,
    saveItemToLocalStorage,
    saveUserDetails,
    getUserDetails,
    logoutUser,
    userLogin
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
};
