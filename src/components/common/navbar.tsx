import { useNavigate } from "react-router-dom";

import Glow1 from "@/assets/background/bg-glow-1.svg";
import Glow2 from "@/assets/background/bg-glow-2.svg";
import LeftRectangle from "@/assets/background/bg-left.svg";
import RightRectangle from "@/assets/background/bg-right.svg";
import RightArrow from "@/assets/icons/right-arrow.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

import useAuthStore from "@/store/authStore";

const Navbar = ({ isHome }: { isHome: boolean }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useAuthStore();
  
  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth/signin");
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col w-full h-fit bg-navbar-color overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-full h-full z-0`}>
        <img src={Glow1} alt="glow" className="absolute -left-72 -top-[400px] object-cover" />
        <img src={Glow2} alt="glow" className="absolute -top-[380px] -right-[520px] object-cover" />
        {isHome && (
          <>
            <img src={LeftRectangle} alt="" className="absolute -left-96 top-48 object-cover" />
            <img src={RightRectangle} alt="" className="absolute -right-36 top-20 object-cover" />
          </>
        )}
      </div>
      <div className="relative z-10 flex flex-row items-center text-white py-5 px-64 gap-12 justify-between">
        <div onClick={() => navigate("/")} className="flex flex-row gap-4 items-center text-3xl font-semibold cursor-pointer">
          <img src="/icon.svg" alt="logo" className="h-10 w-10" />
          AICe
        </div>
        {isAuthenticated ? (
          <>
            <div onClick={() => navigate("/dashboard")} className="flex flex-row items-center gap-4 cursor-pointer">
              <div className="flex flex-row items-center gap-2 text-xl">
                {/* <img src={ProfileIcon} alt="profile" className="h-8 w-8" /> */}
                <div className="text-nowrap cursor-pointer hover:underline-offset-4 hover:underline">{userInfo?.displayName}</div>
              </div>
              <div className="rounded-lg border-2 border-white text-white text-md py-2 px-4 bg-black bg-opacity-10">
                Dashboard
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-row items-center">
            <img src={ProfileIcon} alt="profile" className="h-8 w-8" />
            <div onClick={() => navigate("/auth/signin")} className="flex p-2 px-4 hover:underline-offset-4 hover:underline cursor-pointer text-nowrap text-lg">
              Sign in / Sign up
            </div>
          </div>
        )}
      </div>

      {/* for homepage only */}
      {isHome && (
        <div className="relative z-0 flex flex-col pt-20 pb-20 w-full items-center gap-6">
          <div className="text-6xl font-bold text-white">Land your dream job now!</div>
          <div className="no-wrap text-lg text-white">Enter your job posting URL here or paste your job description and practice interview with our AI now</div>
          <div onClick={handleStartNow} className="group py-3 px-6 mt-4 gap-4 text-xl bg-button-color flex items-center cursor-pointer justify-center text-white rounded-lg font-semibold">
            Start Now
            <img src={RightArrow} alt="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
