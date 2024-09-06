import GoogleAuthButton from "@/components/auth/google";
import Navbar from "@/components/common/navbar";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
