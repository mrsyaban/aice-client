import Navbar from "@/components/common/navbar";
import api from "@/util/api";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = useGoogleLogin({
    onSuccess: (token) => {
      localStorage.setItem("token", token.access_token);
      console.log(token);
      try {
        api.get("/login", {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        });
      } catch {
        console.log("error");
      }
    },
  });
  return (
    <div className="bg-primary-white h-screen">
      <Navbar isHome={false} />
      <div className="flex flex-col w-screen justify-center items-center h-fit pt-32">
        <div className="flex flex-col w-fit items-center gap-10">
          <h1 className="text-3xl font-semibold">Create an account</h1>
          <div className="flex flex-col gap-6 items-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" placeholder="Email address" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" placeholder="Password" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" placeholder="Retype password" />
            <div className="flex items-center w-80 justify-center bg-blue-500 rounded-md px-5 py-3">Continue</div>
            <div className="flex flex-row gap-2">
              Already have an account?{" "}
              <a href="/free/login" className="text-blue-500">
                Login
              </a>
            </div>
            <div className="flex flex-row">
              <div className="h-4 bg-white" />
              or
              <hr />
            </div>
            <button onClick={() => login()} className="flex flex-row items-center w-full border-2 gap-3 rounded-md px-5 py-3 cursor-pointer justify-center font-semibold text-lg">
              <FcGoogle className="w-8 h-8" /> Continue with google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
