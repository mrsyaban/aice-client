import { useEffect, useState, useRef, ChangeEvent, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { format, addHours } from "date-fns";
import { DockIcon, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Job } from "@/types/job";
import { Industry } from "@/types/industry";
import { Interview, InterviewStatus } from "@/types/interview";

import useAuthStore from "@/store/authStore";
import Navbar from "@/components/common/navbar";
import { industriesData } from "@/utils/industry";

import { addVacancy, getCV, uploadCV } from "@/services/api";
import { getInterviews, getVacancies } from "@/services/api";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [industry, setIndustry] = useState<SingleValue<{ value: number; label: string }> | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Cv Analyzer and generate questions
  const [fileName, setFileName] = useState<string>("");

  const textareaRef = useRef(null);
  const questionRef = useRef(null);

  const options = industries.map((industry) => ({
    value: industry.id,
    label: industry.label,
  }));

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      await uploadCV(file).then((res) => {
        if (res) {
          setFileName(res.name);
        }
      }).catch((err) => {
        console.error(err);
      });
    } else {
      toast.error("Please upload a valid pdf resume file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "file/pdf": [".pdf"] },
    multiple: false,
  });

  const handleGenerateQuestions = async () => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
      return;
    }
    if (!jobTitle || !jobDescription || !industry) {
      setErrorMessage("Both job title and job description are required.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const vacancyId = await addVacancy(jobTitle, jobDescription, industry?.label.toString());
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

  const handleAnalyzeInterview = () => {
    navigate("/interview?question=" + interviewQuestion);
  };

  // Auto-expand the textarea as the content changes
  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInterviewQuestion(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Effect to auto-resize on initial render or content paste
  useEffect(() => {
    if (questionRef.current) {
      autoResizeTextarea(questionRef.current);
    }
  }, [interviewQuestion]);

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

  useEffect(() => {
    setIndustries(industriesData.map((industry, index) => ({ id: index, label: industry })));
    getCV().then((res) => {
      if (res) {
        setFileName(res.name);
      }
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    const utcPlus7Date = addHours(date, 7);
    const formattedDate = format(utcPlus7Date, "dd/MM/yyyy-HH:mm a");
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
      <div className="flex flex-col w-full pt-[74px]">
        {/* features */}
        <div className="flex flex-col w-full bg-primary-white items-center px-24 py-12 pb-24 gap-10">
          <h1 className="font-bold text-primary-blue text-4xl">Dashboard</h1>
          <div className="flex flex-col w-full items-center gap-20">
            {/* Resume & Questions */}
            <div className="flex flex-col items-start w-full max-w-[1200px] gap-4">
              <h2 className="text-3xl font-bold text-primary-blue">Land your dream job now!</h2>
              {/* <div className="font-semibold text-xl">Enter all about the details of your dream job.</div> */}

              {/* Job Details */}
              <div className="grid grid-cols-3 w-full gap-x-10 gap-y-6">
                <div className="w-full col-span-2 flex flex-col gap-2">
                  <div className="font-semibold text-base text-primary-blue">Job title</div>
                  <input
                    type="text"
                    onChange={(e) => setJobTitle(e.target.value)}
                    className=" border-primary-blue border-1 border rounded-md py-2 px-4 text-lg text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                    placeholder="ex: Software Engineer, Data Analyst, etc."
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="font-semibold text-base text-primary-blue">Company's industry</div>
                  <Select value={industry} onChange={(e) => setIndustry(e)} options={options} />
                </div>
                <div className="flex flex-col gap-2 w-full col-span-3">
                  <div className="font-semibold text-base text-primary-blue">Job description</div>
                  <textarea
                    ref={textareaRef}
                    value={jobDescription}
                    onChange={handleTextareaChange}
                    className="max-h-96 border border-primary-blue rounded-md py-2 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                    placeholder="paste your detailed job description & job requirement here"
                  />
                </div>
                {!fileName? (
                  <div
                    {...getRootProps()}
                    className={`flex flex-col col-span-3 items-center justify-center bg-white w-full h-20 border-2 border-dashed border-primary-blue rounded-lg p-4 cursor-pointer ${isDragActive ? "border-primary-blue bg-blue-50" : "border-gray-300"}`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <Upload className="mx-auto h-6 w-6 text-primary-blue" />
                      <p className="text-lg text-primary-blue font-semibold">Drag and drop your resume here</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row items-center border border-primary-blue justify-between w-full col-span-3 bg-white font-semibold p-4 rounded-lg">
                    {fileName}
                    <div onClick={() => setFileName("")} className="p-2 px-4 bg-primary-blue cursor-pointer text-white rounded-lg">
                      Upload another resume
                    </div>
                  </div>
                )}
                {errorMessage && <div className="text-red-700 font-semibold col-span-3">{errorMessage}</div>}
              </div>

              {/* Feature */}
              <div className="flex flex-row gap-6 mt-8 grid-cols-2 w-full">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={isLoading}
                  className="py-5 px-8 w-full hover:opacity-90 cursor-pointer bg-primary-blue bg-opacity-20 border-2 border-primary-blue text-primary-blue flex items-center justify-center rounded-lg font-semibold text-xl disabled:opacity-50"
                >
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
                  className="py-5 px-8 w-full hover:opacity-90 cursor-pointer border-2 border-primary-yellow bg-secondary-yellow font-semibold text-xl flex items-center justify-center text-primary-yellow rounded-lg"
                >
                  <DockIcon className="mr-2 h-4 w-4" />
                  Grade my resume
                </div>
              </div>
            </div>

            {/* Analyze Interview */}
            <div className="flex flex-col items-start w-full max-w-[1200px] gap-4">
              <h2 className="text-3xl font-bold text-primary-blue">Ace your interview!</h2>

              {/* Job Details */}
              <div className="grid grid-cols-3 w-full gap-x-10 gap-y-6">
                <div className="flex flex-col gap-2 w-full col-span-3">
                  <div className="font-semibold text-xl text-primary-blue">Interview question</div>
                  <textarea
                    ref={questionRef}
                    value={interviewQuestion}
                    onChange={handleQuestionChange}
                    className="max-h-96 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                    placeholder="Interview question"
                  />
                </div>
                {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
              </div>

              {/* Feature */}
              <div
                onClick={handleAnalyzeInterview}
                className="py-5 px-8 w-full hover:opacity-90 cursor-pointer border-2 border-secondary-purple bg-secondary-purpleLight flex items-center justify-center text-secondary-purple rounded-lg text-xl font-semibold"
              >
                Analyze answers
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-24">
          <div className="grid grid-cols-2 gap-12 py-12 max-w-[1200px] w-full">
            <div className="col-span-2 text-4xl font-bold">Histories</div>
            {/* jobs */}
            <div className="flex flex-col h-fit gap-8 items-center w-full mx-auto border-2 bg-primary-blue bg-opacity-[3%] border-primary-blue p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary-blue w-full text-start">Interview Questions</div>
              {jobs.length > 0 ? (
                <div className="flex flex-col gap-6 w-full ">
                  {jobs
                    // .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((job, idx) => (
                      <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                        <div className="flex flex-col justify-between gap-10 w-full">
                          <div className="flex flex-col w-full justify-between">
                            <div className="flex flex-col justify-between gap-2">
                              <div className="text-2xl font-bold text-primary-blue whitespace-nowrap overflow-hidden text-ellipsis">{job.title}</div>
                              <div className="text-lg text-primary-blue font-mdeium text-ellipsis line-clamp-5 whitespace-pre-wrap">{job.description}</div>
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-center">
                            <div className="text-lg text-primary-blue text-left w-full font-semibold">Generated on {formatDate(job.created_at || new Date())}</div>
                            <div
                              onClick={() => navigate(`/questions/${job.id}`)}
                              className="py-2 px-6 bg-primary-blue hover:bg-opacity-80 text-white font-bold w-fit flex items-center justify-center cursor-pointer h-fit rounded-md text-nowrap"
                            >
                              View Questions
                            </div>
                          </div>
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
                    // .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((interview, idx) => (
                      <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                        <div className="flex flex-col w-full gap-10">
                          <div className="text-2xl font-bold text-[#a057e9] overflow-hidden text-ellipsis line-clamp-4 whitespace-pre-wrap">{interview.question}</div>
                          <div className="flex flex-row justify-between items-center">
                            <div className="text-lg text-[#a057e9] text-nowrap text-left font-semibold">Generated on {formatDate(interview.created_at || new Date())}</div>
                            <div
                              onClick={() => navigate(`/interview-analysis-result/${interview.id}`)}
                              className={`py-2 px-6  font-bold w-fit hover:bg-opacity-80 flex items-center h-fit rounded-md justify-center cursor-pointer text-nowrap ${
                                interview.status === InterviewStatus.SUCCESS ? "bg-[#a057e9] text-white" : " border text-[#a057e9] bg-[#c59eeb] border-[#a057e9]"
                              }`}
                            >
                              {interview.status === InterviewStatus.SUCCESS ? "View Analysis" : "Analyzing..."}
                            </div>
                          </div>
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
