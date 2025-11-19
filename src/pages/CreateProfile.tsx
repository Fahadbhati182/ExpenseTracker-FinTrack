import { assets } from "@/assets/assets";
import { useApp } from "@/context/AppContext";
import type { User } from "@/types/User";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreateProfileProps {
  name: string;
  email: string;
  gender: string;
  monthlyBudget: string;
  password: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  setMonthlyBudget: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleOnSubmit: (e: React.FormEvent) => void;
  setIsLoginSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: (e: React.FormEvent) => void;
  setIsLoginSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateProfilePage({
  setName,
  setEmail,
  setGender,
  setMonthlyBudget,
  setPassword,
  name,
  email,
  gender,
  monthlyBudget,
  password,
  handleOnSubmit,
  setIsLoginSelected
}: CreateProfileProps) {
  return (<div className="flex w-full flex-col gap-8 rounded-xl border border-black/10 dark:border-white/10 bg-[#0B0F0E] p-6 md:p-10 shadow-lg">

    {/* Heading */}
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <p className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
        Create Your Profile
      </p>
      <p className="text-white/60 text-base font-normal">
        Let's get your account set up with some basic information.
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="fullName"
          className="text-white text-base font-medium"
        >
          Full Name
        </label>

        <input
          id="fullName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your full name"
          className="h-14 flex w-full rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-white text-base font-medium"
        >
          Email Address
        </label>

        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email address"
          className="h-14 flex w-full rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-white text-base font-medium"
        >
          Passoword
        </label>

        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          className="h-14 flex w-full rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-white text-base font-medium"
        >
          Monthly Budget
        </label>

        <input
          id="monthlyBudget"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
          type="number"
          placeholder="Enter your monthly budget"
          className="h-14 flex w-1/2 rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
        />
      </div>
      {/* Gender */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-base font-medium leading-tight">
          Gender
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Male */}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/20 p-4 
                has-[:checked]:border-[#00FF6A] has-[:checked]:bg-[#00FF6A]/20 
                has-[:checked]:ring-2 has-[:checked]:ring-[#00FF6A]/50"
          >
            <input
              type="radio"
              checked={gender === "male"}
              onChange={() => setGender("male")}
              name="gender"
              value="male"
              className="h-5 w-5 bg-transparent border-white/30 text-[#00FF6A]"
            />
            <span className="text-white text-base font-normal">Male</span>
          </label>

          {/* Female */}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/20 p-4 
                has-[:checked]:border-[#00FF6A] has-[:checked]:bg-[#00FF6A]/20 
                has-[:checked]:ring-2 has-[:checked]:ring-[#00FF6A]/50"
          >
            <input
              type="radio"
              checked={gender === "female"}
              onChange={() => setGender("female")}
              name="gender"
              value="female"
              className="h-5 w-5 bg-transparent border-white/30 text-[#00FF6A]"
            />
            <span className="text-white text-base font-normal">Female</span>
          </label>

          {/* Prefer not to say */}

        </div>
      </div>

      {/* Submit */}
      <div className="flex pt-4">
        <button
          type="submit"
          className="flex w-full h-14 items-center justify-center rounded-lg 
              bg-[#00FF6A] text-black font-bold tracking-[0.015em] hover:bg-[#00FF6A]/90 
              active:bg-[#00FF6A]/80 cursor-pointer"
        >
          Save & Continue
        </button>
      </div>
      <p onClick={() => setIsLoginSelected((prev) => !prev)} className="text-sm text-[#00FF6A] hover:cursor-pointer underline ">Already Have a Profile</p>
    </form>
  </div>);
}

function LoginProfilePage({ email, password, setEmail, setPassword, handleLogin, setIsLoginSelected }: LoginProps) {
  return (
    <div className="flex w-full flex-col gap-8 rounded-xl border border-black/10 dark:border-white/10 bg-[#0B0F0E] p-6 md:p-10 shadow-lg">

      {/* Heading */}
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
          Create Your Profile
        </p>
        <p className="text-white/60 text-base font-normal">
          Let's get your account set up with some basic information.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-6">

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-white text-base font-medium"
          >
            Email Address
          </label>

          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email address"
            className="h-14 flex w-full rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-white text-base font-medium"
          >
            Passoword
          </label>

          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="h-14 flex w-full rounded-lg border border-white/20 bg-transparent text-white 
              placeholder:text-white/40 p-[15px] text-base font-normal focus:outline-none 
              focus:ring-2 focus:ring-[#00FF6A]/50"
          />
        </div>

        {/* Submit */}
        <div className="flex pt-4" >
          <button
            type="submit"
            className="flex w-full h-14 items-center justify-center rounded-lg 
              bg-[#00FF6A] text-black font-bold tracking-[0.015em] hover:bg-[#00FF6A]/90 
              active:bg-[#00FF6A]/80 cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
        <p onClick={() => setIsLoginSelected((prev) => !prev)} className="text-sm text-[#00FF6A] hover:cursor-pointer underline ">Create Your Profile</p>
      </form >
    </div >
  );
}

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [isLoginSelected, setIsLoginSelected] = useState(false);

  const { saveUserDetails, userLogin } = useApp()
  const navigate = useNavigate()


  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || gender.trim() === "" || monthlyBudget.trim() === "" || password.trim() === "") {
      alert("Please fill all the fields");
      return;
    }
    let img;
    if (gender == "male") {
      img = assets.maleAvatar
    } else {
      img = assets.femaleAvatar
    }
    const userDetails: User = { id: Date.now(), name, email, gender, password, img, monthlyBudget: Number(monthlyBudget) };
    console.log(userDetails)
    saveUserDetails(userDetails);
    navigate("/")

    setName("");
    setEmail("");
    setGender("");
    setMonthlyBudget("");

  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill all the fields");
      return;
    }
    userLogin(email, password);
    toast.success("Login Successful")
    navigate("/")
  }

  return (
    <main className="w-full max-w-2xl px-4 py-8 mt-24 sm:mt-0 mx-auto">
      {isLoginSelected
        ? LoginProfilePage({
          email,
          password,
          setEmail,
          setPassword,
          handleLogin,
          setIsLoginSelected
        })
        : CreateProfilePage({
          setName,
          setEmail,
          setGender,
          setMonthlyBudget,
          setPassword,
          name,
          email,
          gender,
          monthlyBudget,
          password,
          handleOnSubmit,
          setIsLoginSelected
        })
      }


    </main>
  );
};

export default CreateProfile;
