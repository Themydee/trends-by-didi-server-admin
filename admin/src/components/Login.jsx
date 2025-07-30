import React, { useState } from "react";
import logo from "../assets/loginImg.png";
import logoImg from "../assets/logo.png";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(server_url + "/api/user/admin", {
        email,
        password,
      });

      if (response.data?.token) {
        toast.success("Welcome Admin 👋", { theme: "colored" });
        setToken(response.data.token);
      } else {
        toast.error("Access denied!", { autoClose: 5000 });
      }
    } catch (error) {
      toast.error("Invalid admin credentials");
      console.error(error);
    }
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      <div className="flex h-full w-full ">
        <div className="w-1/2 hidden:sm:block">
          <img src={logo} alt="" className="object-cover h-full w-full " />
        </div>

        <div className="flex w-full sm:w-1/2 items-center justify-center">
          <form
            action=""
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800"
          >
            <div className="w-full mb-4 flex items-center gap-3">
              <h3 className="text-xl font-semibold">Login</h3>
              <img
                src={logoImg}
                alt="Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="medium-15">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="email"
                className="w-full px-3 py-1.5 ring-1 ring-slate-900/10 bg-primary mt-1"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="medium-15">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="password"
                className="w-full px-3 py-1.5 ring-1 ring-slate-900/10 bg-primary mt-1"
                required
              />
            </div>
            <button className="btn-dark w-full mt-5 !py-[9px]" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
