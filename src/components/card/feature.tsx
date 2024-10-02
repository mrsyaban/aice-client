import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const FeatureCard = ({ title, description, path, color }: { title: string; description: string; path: string; color: string}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const handleClicked = () => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/auth/signin");
    }
  };


  return (
    <div onClick={handleClicked} className={`flex flex-col p-6 w-[243px] h-[286px] justify-between items-center gap-12 ${color} rounded-xl`}>
      <div className="flex flex-col items-center gap-8">
        <div className="text-3xl text-white font-bold text-center">{title}</div>
        <div className="text-lg text-white text-wrap text-center">{description}</div>
      </div>
      {/* <div onClick={handleClicked} className="py-4 px-8 bg-button-color rounded-lg font-semibold text-white cursor-pointer">
        {command}
      </div> */}
    </div>
  );
};

export default FeatureCard;
