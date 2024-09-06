import FeatureCard from "@/components/card/feature";
import Navbar from "@/components/common/navbar";
import { getInterviews, getVacancies } from "@/services/api";
import { Interview, InterviewStatus } from "@/types/interview";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getVacancies()
      .then((res) => {
        setJobs(res);
      })
      .catch((err) => {
        console.log(err);
      });

    getInterviews()
      .then((res) => {
        setInterviews(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar isHome={false} />
      <div className="flex flex-col gap-16 w-full bg-primary-white">
        {/* features */}
        <div className="flex flex-col h-fit gap-8 items-center pt-12">
          <div className="flex flex-row gap-24">
            <FeatureCard title="AI mock Interview" description="Provide your job details and get targeted practice questions designed to help you tackle any interview challenge confidently." path="mock-interview" command="Get interview questions" />
            <FeatureCard title="AI Grader" description="Simulate real interviews on our site and get in-depth feedback to perfect your performance." path="interview" command="Grade my interview" />
            <FeatureCard title="CV Analyzer" description="Stop using the same CV for every job! Our AI analyze your CV to make it relevance with each job vacancy" path="cv-analyzer" command="Analyze my CV" />
          </div>
        </div>
        {/* jobs */}
        <div className="flex flex-col h-fit gap-8 items-center w-full max-w-[1000px] mx-auto">
          <div className="text-3xl font-bold text-primary-blue w-full text-start">Jobs you've generated</div>
          {jobs.length > 0 ? (
            <div className="flex flex-col gap-6 w-full ">
              {jobs.map((job, idx) => (
                <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                  <div className="flex flex-col justify-between gap-2">
                    <div className="text-2xl font-bold text-primary-blue">{job.title}</div>
                    <div className="text-lg text-primary-blue font-semibold">{job.description}</div>
                    <div className="text-lg text-primary-blue pt-12">Generated on {job.createdAt}</div>
                  </div>
                  <div onClick={()=> navigate(`/questions/${job.id}`)} className="py-4 px-6 bg-primary-blue text-white font-bold w-fit flex items-center justify-center cursor-pointer h-fit rounded-md">View Questions</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full py-4 px-6 bg-white rounded-lg text-lg justify-center">You don't have any generated jobs yet.</div>
          )}
        </div>

        {/* interview questions analyzed */}
        <div className="flex flex-col h-fit gap-8 items-center w-full max-w-[1000px] mx-auto">
          <div className="text-3xl font-bold text-primary-blue w-full text-start">Analyzed interview</div>
          {interviews.length === 0 ? (
            <div className="flex w-full py-4 px-6 bg-white rounded-lg text-lg justify-center">You don't have any analyzed interviews yet.</div>
          ) : (
            <div className="flex flex-col gap-6 w-full max-w-[1000px]">
              {interviews.map((interview, idx) => (
                <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                  <div className="flex flex-col justify-between gap-2">
                    <div className="text-2xl font-bold text-primary-blue">{interview.question}</div>
                    <div className="text-lg text-primary-blue pt-12">Generated on {interview.updatedAt}</div>
                  </div>
                  <div className="py-4 px-6 bg-primary-blue text-white font-bold w-fit hover:bg-opacity-80 flex items-center h-fit rounded-md justify-center cursor-pointer text-nowrap">{interview.status === InterviewStatus.SUCCESS ? "View Analysis" : "Analyzing..."}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
