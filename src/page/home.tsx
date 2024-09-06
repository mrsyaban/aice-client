import { useNavigate } from "react-router-dom";

import Navbar from "@/components/common/navbar";
import { useEffect, useState } from "react";
// import { getResult } from "@/services/api";
// import FeatureCard from "@/components/card/feature";

const Home = () => {
  const navigate = useNavigate();
  const [jobPosting, setJobPosting] = useState<string>("");

  useEffect(() => {
    // getResult()
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    console.log(jobPosting);
  }, [jobPosting]);

  return (
    <div className="h-screen w-full bg-primary-white">
      <Navbar isHome={true} />
      <div className="flex flex-col gap-16 items-center h-fit pt-12">
        <div className="flex flex-col h-fit gap-8 items-center">
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
            <div onClick={() => navigate("/cv-analyzer")} className="py-5 px-8 cursor-pointer bg-button-color flex items-center justify-center text-white rounded-lg font-bold">Analyze my resume</div>
          </div>
        </div>
        {/* <div className="flex flex-col h-fit gap-8 items-center pb-12">
          <div className="text-3xl font-bold text-primary-blue">Try out our features here!</div>
          <div className="flex flex-row gap-24">
            <FeatureCard title="AI mock Interview" description="Generate questions for your upcoming interview here." path="interview" command="Generate questions" />
            <FeatureCard title="AI Grader" description="Get graded by AI to prepare for an interview here." path="interview" command="Grade my interview" />
            <FeatureCard title="CV Analyzer" description="Make sure your CV is ATS-friendly  here." path="interview" command="Analyze my CV" />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
