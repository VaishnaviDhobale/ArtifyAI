// import React from 'react'
import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignupForm = async (event) => {
    event.preventDefault();
  
    try {
      if (state === "Login") {

        // for login 
        const loginData = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
  
        if (loginData.data.success) {
          setToken(loginData.data.token);
          setUser(loginData.data.user);
          localStorage.setItem("token", loginData.data.token);
          localStorage.setItem("user",loginData.data.user)
          setShowLogin(false);
        } else {
          console.log("Login failed:", loginData.data.message);
          toast.error(loginData.data.message || "Login failed");
        }
      } else {
        // for registration 
        const regiData = await axios.post(`${backendUrl}/api/user/register`, {
          email,
          password,
          name,
        });
        console.log(regiData);
  
        if (regiData.data.success) {
          console.log("Registration successful");
          setToken(regiData.data.token); // Ensure it's regiData.data.token
          setUser(regiData.data.user); // Ensure it's regiData.data.user
          localStorage.setItem("token", regiData.data.token);
          setShowLogin(false);
          console.log("done");
        } else {
          console.log("Registration failed:", regiData.data.message);
          toast.error(regiData.data.message || "Registration failed");
        }
      }
    } catch (error) {
     toast.error(error?.response?.data?.message || error?.message)
    }
  };
  

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center"
      initial={{ opacity: 0.2, y: 50 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <form
        onSubmit={handleSignupForm}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm mt-2">Welcome back! Please {state} to continue</p>

        {state == "SignUp" ? (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img className="h-6" src={assets.profile_icon} alt="" />
            <input
              className="outline-none text-sm"
              type="text"
              placeholder="Full Name"
              required
              name="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>
        ) : null}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img className="h-[12px]" src={assets.email_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="email"
            placeholder="Email"
            required
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img className="h-[12px]" src={assets.lock_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="password"
            placeholder="Password"
            required
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>

        {state == "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot Password?
          </p>
        )}
        <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-6">
          {state == "Login" ? "Login" : "Create Account"}
        </button>

        {state == "Login" ? (
          <p className="mt-5 text-center">
            Dont have account?{" "}
            <span
              onClick={() => {
                setState("SignUp");
              }}
              className="text-blue-600 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Alredy have account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => {
            setShowLogin(false);
          }}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </form>
    </motion.div>
  );
};

export default SignUp;
