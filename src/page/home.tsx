import { useNavigate } from "react-router-dom";

import Navbar from "@/components/common/navbar";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [jobPosting, setJobPosting] = useState<string>("");

  useEffect(() => {
    console.log(jobPosting);
  }, [jobPosting]);

  return (
    <div className="h-screen bg-primary-white">
      <Navbar isHome={true}/>
      <div className="flex flex-col gap-8 items-center h-fit pt-12">
        <div className="text-4xl font-bold text-primary-blue">Paste your job posting here!</div>
        <input 
          type="text"
          onChange={(e) => setJobPosting(e.target.value)} 
          className="w-[640px] border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue" 
          placeholder="Job Title"
          />
        <input 
          type="text"
          onChange={(e) => setJobPosting(e.target.value)} 
          className="w-[640px] border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue" 
          placeholder="Job Description"
          />
        <div className="flex flex-row gap-6">
            <div onClick={() => navigate("/questions")} className="py-5 px-8 cursor-pointer bg-button-color flex items-center justify-center text-white rounded-lg font-bold">
                Get interview questions
            </div>
            <div className="py-5 px-8 bg-button-color flex items-center justify-center text-white rounded-lg font-bold">
                Analyze my resume
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
