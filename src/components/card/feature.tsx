import { useNavigate } from "react-router-dom";


const FeatureCard = ({ title, description, path, command }: { title: string; description: string; path: string; command:string }) => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col p-6 w-72 justify-between items-center h-full gap-12 bg-white rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="text-xl text-primary-blue font-bold text-nowrap">{title}</div>
        <div className="text-lg text-[#68718B] text-wrap text-center">{description}</div>
      </div>
      <div onClick={()=> navigate(path)} className="py-4 px-8 bg-button-color rounded-lg font-semibold text-white cursor-pointer">
        {command}
      </div>
    </div>
  );
};

export default FeatureCard;
