import FeatureCard from "@/components/card/feature";
import Navbar from "@/components/common/navbar";

const jobs = [
  {
    title: "Software Engineer",
    createdAt: "2021-09-12",
  },
  {
    title: "Software Engineer",
    createdAt: "2021-09-12",
  },
];

const interviews = [
  {
    id: 1,
    question: "Tell me about yourself!",
    status: "graded",
    updatedAt: "2021-09-12",
  },
  {
    id: 1,
    question: "Tell me about yourself!",
    status: "video uploaded",
    updatedAt: "2021-09-12",
  }
];

const Dashboard = () => {
  return (
    <>
      <Navbar isHome={false} />
      <div className="flex flex-col gap-16 w-full bg-primary-white">
        {/* features */}
        <div className="flex flex-col h-fit gap-8 items-center pt-12">
          <div className="flex flex-row gap-24">
            <FeatureCard title="AI mock Interview" description="Generate questions for your upcoming interview here." path="interview" command="Generate questions" />
            <FeatureCard title="AI Grader" description="Get graded by AI to prepare for an interview here." path="interview" command="Grade my interview" />
            <FeatureCard title="CV Analyzer" description="Make sure your CV is ATS-friendly  here." path="interview" command="Analyze my CV" />
          </div>
        </div>
        {/* jobs */}
        <div className="flex flex-col h-fit gap-8 items-center w-full max-w-[1000px] mx-auto">
          <div className="text-3xl font-bold text-primary-blue w-full text-start">Jobs you've generated</div>
          <div className="flex flex-col gap-6 w-full ">
            {jobs.map((job, idx) => (
              <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                <div className="flex flex-col justify-between gap-2">
                  <div className="text-2xl font-bold text-primary-blue">{job.title}</div>
                  <div className="text-lg text-primary-blue">Generated on {job.createdAt}</div>
                </div>
                <div className="py-4 px-6 bg-primary-blue text-white font-bold w-fit flex items-center justify-center cursor-pointer">
                  View Questions
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* interview questions analyzed */}
        <div className="flex flex-col h-fit gap-8 items-center w-full max-w-[1000px] mx-auto">
          <div className="text-3xl font-bold text-primary-blue w-full text-start">Analyzed interview</div>
          <div className="flex flex-col gap-6 w-full max-w-[1000px]">
            {interviews.map((interview, idx) => (
              <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                <div className="flex flex-col justify-between gap-2">
                  <div className="text-2xl font-bold text-primary-blue">{interview.question}</div>
                  <div className="text-lg text-primary-blue">Generated on {interview.updatedAt}</div>
                </div>
                <div className="py-4 px-6 bg-primary-blue text-white font-bold w-fit flex items-center justify-center cursor-pointer">
                  {interview.status === "graded" ? "View Analyzed" : "Analyzing..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
