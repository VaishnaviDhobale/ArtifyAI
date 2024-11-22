// import React from 'react'
import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const SignUp = () => {
  const [state, setState] = useState("Login");
  const {setShowLogin } = useContext(AppContext);

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
      <form className="relative bg-white p-10 rounded-xl text-slate-500">
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
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img className="h-[12px]" src={assets.lock_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="password"
            placeholder="Password"
            required
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
