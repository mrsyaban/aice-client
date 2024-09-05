import Navbar from "@/components/common/navbar";
import api from "@/util/api";
import {
  // GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
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
    <div className="h-screen bg-primary-white">
      <Navbar isHome={false} />
      <div className="flex flex-row w-screen justify-center items-center h-fit pt-32">
        <div className="flex flex-col w-fit items-center gap-10">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <div className="flex flex-col gap-6 items-center">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" 
              placeholder="Email address" 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" 
              placeholder="Password" 
            />
            <div className="flex items-center w-80 justify-center bg-button-color rounded-md px-5 py-3 cursor-pointer">Continue</div>
            <div className="flex flex-row gap-2">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-blue-500">
                Sign Up
              </a>
            </div>
            <div className="flex flex-row items-center w-80">
              <hr className="flex-grow border-t border-white" />
              <span className="mx-2 text-white">or</span>
              <hr className="flex-grow border-t border-white" />
            </div>
            {/* <GoogleLogin
              onSuccess={async (credentialResponse) => {
                localStorage.setItem("token", credentialResponse.credential || "");
                console.log(credentialResponse.credential);
                console.log(jwtDecode(credentialResponse.credential || ""));
                try {
                  await api.get("/login", {
                    headers: {
                      Authorization: `Bearer ${credentialResponse.credential}`,
                    },
                  });
                } catch {
                  console.log("error");
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            /> */}
            <button onClick={() => login()} className="flex flex-row items-center w-full border-2 gap-3 rounded-md px-5 py-3 cursor-pointer justify-center font-semibold text-lg">
              <FcGoogle className="w-8 h-8"/> Continue with google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
