import Navbar from "@/components/common/navbar";
import { getInterviews, getVacancies } from "@/services/api";
import { Interview, InterviewStatus } from "@/types/interview";
import { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";
import { format, addHours } from "date-fns";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/store/authStore";

import { addVacancy } from "@/services/api";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleGenerateQuestions = async () => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
      return;
    }
    if (!jobTitle || !jobDescription) {
      setErrorMessage("Both job title and job description are required.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const vacancyId = await addVacancy(jobTitle, jobDescription);
      navigate(`/questions/${vacancyId}`);
    } catch (error) {
      console.error("Error generating questions:", error);
      setErrorMessage("An error occurred while generating questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCV = () => {
    navigate("/cv-analyzer?jobTitle=" + jobTitle + "&jobDescription=" + jobDescription);
  };

  const textareaRef = useRef(null);

  // Auto-expand the textarea as the content changes
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Auto-resize function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Effect to auto-resize on initial render or content paste
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [jobDescription]);

  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    const utcPlus7Date = addHours(date, 7);
    const formattedDate = format(utcPlus7Date, "dd MMM yyyy HH:mm a");
    return formattedDate;
  };
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
      <div className="flex flex-col w-full ">
        {/* features */}
        <div className="flex flex-col w-full bg-primary-white items-center px-24 py-12 pb-24 gap-10">
          <h1 className="font-bold text-primary-blue text-4xl">Dashboard</h1>
          <div className="flex flex-col items-start w-full max-w-[1200px] gap-4">
            <h2 className="text-3xl font-bold text-primary-blue">Land your dream job now!</h2>
            {/* <div className="font-semibold text-xl">Enter all about the details of your dream job.</div> */}

            {/* Job Details */}
            <div className="grid grid-cols-3 w-full gap-x-10 gap-y-6">
              <div className="w-full col-span-2 flex flex-col gap-2">
                <div className="font-semibold text-xl text-primary-blue">Job title</div>
                <input
                  type="text"
                  onChange={(e) => setJobTitle(e.target.value)}
                  className=" border-primary-blue border-1 border rounded-md py-4 px-4 text-lg text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                  placeholder="Job Title"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="font-semibold text-xl text-primary-blue">Company's industry</div>
                <input
                  type="text"
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="border-primary-blue border-1 border rounded-md py-4 px-4 text-lg text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                  placeholder="Company's industry"
                />
              </div>
              <div className="flex flex-col gap-2 w-full col-span-3">
                <div className="font-semibold text-xl text-primary-blue">Job description</div>
                <textarea
                  ref={textareaRef}
                  value={jobDescription}
                  onChange={handleTextareaChange}
                  className="max-h-96 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                  placeholder="Job Description"
                />
              </div>
              {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
            </div>

            {/* Feature */}
            <div className="flex flex-row gap-6 mt-8 grid-cols-3 w-full">
              <button onClick={handleGenerateQuestions} disabled={isLoading} className="py-5 px-8 w-full hover:opacity-90 cursor-pointer bg-primary-blue bg-opacity-20 border-2 border-primary-blue text-primary-blue flex items-center justify-center rounded-lg font-semibold text-xl disabled:opacity-50">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating questions...
                  </>
                ) : (
                  "Get interview questions"
                )}
              </button>
              <div
                onClick={handleAnalyzeCV}
                className="py-5 px-8 w-full hover:opacity-90 cursor-pointer border-2 border-secondary-purple bg-secondary-purpleLight flex items-center justify-center text-secondary-purple rounded-lg text-xl font-semibold"
              >
                Analyze answers
              </div>
              <div onClick={handleAnalyzeCV} className="py-5 px-8 w-full hover:opacity-90 cursor-pointer border-2 border-primary-yellow bg-secondary-yellow font-semibold text-xl flex items-center justify-center text-primary-yellow rounded-lg">
                Grade my resume
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-24">
          <div className="grid grid-cols-2 gap-12 py-12 max-w-[1200px] w-full">
            <div className="col-span-2 text-4xl font-bold">Histories</div>
            {/* jobs */}
            <div className="flex flex-col h-fit gap-8 items-center w-full mx-auto border-2 bg-primary-blue bg-opacity-10 border-primary-blue p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary-blue w-full text-start">Interview Questions</div>
              {jobs.length > 0 ? (
                <div className="flex flex-col gap-6 w-full ">
                  {jobs
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((job, idx) => (
                      <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                        <div className="flex flex-col justify-between gap-2 w-full">
                          <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-col justify-between gap-2">
                              <div className="text-2xl font-bold text-primary-blue whitespace-nowrap overflow-hidden text-ellipsis">{job.title}</div>
                              <div className="text-lg text-primary-blue font-semibold overflow-hidden text-ellipsis line-clamp-5 whitespace-pre-wrap">{job.description}</div>
                            </div>
                            <div onClick={() => navigate(`/questions/${job.id}`)} className="py-2 px-6 bg-primary-blue text-white font-bold w-fit flex items-center justify-center cursor-pointer h-fit rounded-md text-nowrap">
                              View Questions
                            </div>
                          </div>
                          <div className="text-lg text-primary-blue pt-4 text-right w-full">Generated on {formatDate(job.created_at)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex w-full py-4 px-6 bg-white rounded-lg text-lg justify-center">You don't have any generated jobs yet.</div>
              )}
            </div>

            {/* interview questions analyzed */}
            <div className="flex flex-col h-fit gap-8 items-center w-full mx-auto border-2 bg-opacity-50 border-secondary-purple bg-secondary-purpleLight  p-6 rounded-lg">
              <div className="text-3xl font-bold text-[#a057e9] w-full text-start">Analyzed interviews</div>
              {interviews.length === 0 ? (
                <div className="flex w-full py-4 px-6 bg-white rounded-lg text-lg justify-center">You don't have any analyzed interviews yet.</div>
              ) : (
                <div className="flex flex-col gap-6 w-full max-w-[1000px]">
                  {interviews
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((interview, idx) => (
                      <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                        <div className="flex flex-col justify-between gap-2">
                          <div className="text-2xl font-bold text-[#a057e9] overflow-hidden text-ellipsis line-clamp-4 whitespace-pre-wrap">{interview.question}</div>
                          <div className="text-lg text-[#a057e9] pt-12 text-nowrap text-right">Generated on {formatDate(interview.created_at)}</div>
                        </div>
                        <div
                          onClick={() => navigate(`/interview-analysis-result/${interview.id}`)}
                          className="py-2 px-6 bg-[#a057e9] text-white font-bold w-fit hover:bg-opacity-80 flex items-center h-fit rounded-md justify-center cursor-pointer text-nowrap"
                        >
                          {interview.status === InterviewStatus.SUCCESS ? "View Analysis" : "Analyzing..."}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
