import { ChangeEvent, useRef, useEffect, useState, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
// import { Loader2 } from "lucide-react";

import { Industry } from "@/types/industry";
import SonImage from "@/assets/testi/son.png";
import TestiCard from "@/components/card/testi";
import Navbar from "@/components/common/navbar";
import { industriesData } from "@/utils/industry";
import FeatureCard from "@/components/card/feature";
import RightArrow from "@/assets/icons/right-arrow.svg";

import { analyzeCV, getCV, uploadCV } from "@/services/api";
import useAuthStore from "@/store/authStore";
// import { addVacancy } from "@/services/api";

const Home = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState<SingleValue<{ value: number; label: string }> | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const [fileName, setFileName] = useState<string>("");

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

  const options = industries.map((industry) => ({
    value: industry.id,
    label: industry.label,
  }));

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
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
  }, [isAuthenticated, navigate]);




  const handleStartNow = async () => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
    if (!jobTitle || !jobDescription || !industry || !fileName) {
      setErrorMessage("cv, job title, company's industry, and job description are required.");
      return;
    }

    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const resultTemp = await analyzeCV(jobTitle, jobDescription, industry.label.toString());
        console.log("result:",resultTemp)
        const resumeResult = JSON.stringify(resultTemp);
        localStorage.setItem("resume-result", resumeResult);
        localStorage.setItem("resume-details", JSON.stringify({ jobTitle, jobDescription }));
        navigate("/cv-analyzer/result");
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred while analyzing your resume. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "file/pdf": [".pdf"] },
    multiple: false,
  });

  // const handleGenerateQuestions = async () => {
  //   if (!isAuthenticated) {
  //     navigate("/auth/signin");
  //     return;
  //   }
  //   if (!jobTitle || !jobDescription || !industry) {
  //     setErrorMessage("job title, company's industry, and job description are required.");
  //     return;
  //   }
  //   setIsLoading(true);
  //   setErrorMessage("");
  //   try {
  //     const vacancyId = await addVacancy(jobTitle, jobDescription, industry.label.toString());
  //     navigate(`/questions/${vacancyId}`);
  //   } catch (error) {
  //     console.error("Error generating questions:", error);
  //     setErrorMessage("An error occurred while generating questions. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAnalyzeCV = () => {
  //   navigate("/cv-analyzer?jobTitle=" + jobTitle + "&jobDescription=" + jobDescription);
  // };

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

  return (
    <div className="h-screen w-full bg-primary-white">
      <Navbar isHome={false} />
      <div className="h-[74px]" />
      <div className="flex flex-col pt-20 pb-32 w-full items-center gap-6 bg-primary-white">
        <div className="text-6xl font-semibold text-black justify-center text-center">
          <span className="text-[#1b45b4]">A</span>utomated&nbsp;
          <span className="text-[#1b45b4]">I</span>nterview
          <br />
          <span className="text-[#1b45b4]">C</span>ompetence&nbsp;
          <span className="text-[#1b45b4]">E</span>valuator&nbsp;
        </div>
        <div className="no-wrap text-lg text-black text-center">
          Fear of job interviews are a thing of the past. Take control of your life
          <br />
          and land your dream job with our AI-powered interview evaluator.
        </div>

        <div className="flex flex-col h-fit gap-6 mt-8 items-center w-full max-w-[900px]">
          <div className="grid grid-cols-3 w-full gap-x-10 gap-y-3 ">
            <div className="w-full col-span-2 flex flex-col gap-2">
              <div className="font-semibold text-base text-primary-blue">Job title</div>
              <input
                type="text"
                onChange={(e) => setJobTitle(e.target.value)}
                className=" border-primary-blue border-1 border rounded-md py-2 px-3 text-base text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                placeholder="ex: Software Engineer, Data Analyst, etc."
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="font-semibold text-base text-primary-blue">Company's industry</div>
              <Select className="h-full cursor-pointer " value={industry} onChange={(e) => setIndustry(e)} options={options} />
            </div>
            <div className="flex flex-col gap-2 w-full col-span-3">
              <div className="font-semibold text-base text-primary-blue">Job description</div>
              <textarea
                ref={textareaRef}
                value={jobDescription}
                onChange={handleTextareaChange}
                className="max-h-96 border border-primary-blue rounded-md py-2 px-3 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                placeholder="paste your detailed job description & job requirement here"
              />
            </div>
            {errorMessage && <div className="text-red-700 font-semibold w-full col-span-3">{errorMessage}</div>}
          </div>
          {!fileName ? (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center bg-white w-full max-w-[960px] h-20 border-2 border-dashed border-primary-blue rounded-lg p-4 cursor-pointer ${
                isDragActive ? "border-primary-blue bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <Upload className="mx-auto h-6 w-6 text-primary-blue" />
                <p className="text-lg text-primary-blue font-semibold">Drag and drop your resume here</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center border border-primary-blue justify-between w-full bg-white font-semibold p-4 rounded-lg">
              {fileName}
              <div onClick={()=>setFileName("")} className="p-2 px-4 bg-primary-blue cursor-pointer text-white rounded-lg">
                Upload another resume
              </div>
            </div>
          )}
          <div className="flex flex-row gap-2 text-yellow-600 w-full p-4 py-2 border-2 border-opacity-45 border-yellow-400 rounded-lg bg-yellow-400 bg-opacity-15">
            <span className="font-bold">Note:</span>
            we are commited to protecting your privacy and data.
          </div>

          {isLoading ? (
            <div className="flex flex-row w-full justify-center items-center gap-2">
              <Loader2 className="animate-spin" />
              Analyzing your profile...
            </div>
          ) : (
            <div onClick={handleStartNow} className="group py-3 px-6 mt-4 gap-4 text-xl bg-button-color flex items-center cursor-pointer justify-center text-white rounded-lg font-semibold">
              Start Now
              <img src={RightArrow} alt="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          )}

          {/* <div className="flex flex-row gap-6 mt-2 grid-cols-2 w-full">
            <button
              onClick={handleGenerateQuestions}
              disabled={isLoading}
              className="py-3 w-full hover:opacity-90 cursor-pointer bg-primary-blue bg-opacity-20 border-2 border-primary-blue text-primary-blue flex items-center justify-center rounded-lg font-semibold text-xl disabled:opacity-50"
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
            <div onClick={handleAnalyzeCV} className="py-3 w-full hover:opacity-90 cursor-pointer border-2 border-primary-yellow bg-secondary-yellow font-semibold text-xl flex items-center justify-center text-primary-yellow rounded-lg">
              Grade my resume
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col gap-16 items-center h-fit bg-primary-white">
        <div className="flex flex-col h-fit w-full gap-12 items-center py-12 bg-[#f0f0f0]">
          <div className="text-4xl font-bold text-primary-blue">What makes us different</div>
          <div className="flex flex-row gap-24 h-full">
            <FeatureCard title="AI mock interview" description="AI-powered live mock interview that helps you prepare for the real deal" path="mock-interview" color="bg-[#1b45b4]" />
            <FeatureCard title="Interview analyzer" description="Get an in-depth analysis on your attitude, answer, and expressions to be better" path="interview" color="bg-[#9937c6]" />
            <FeatureCard title="Resume grader" description="Craft a new powerful resume to attract recruiters and get a call to the next round" path="cv-analyzer" color="bg-[#b4491b]" />
          </div>
        </div>
        <div className="flex flex-col h-fit gap-8 items-center bg-primary-white w-full pb-16">
          <div className="flex flex-row justify-center gap-24 h-full">
            <TestiCard image={SonImage} message="feel so much more confident after I used AICe." nick="John Doe" age={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
