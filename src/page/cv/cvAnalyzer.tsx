import Navbar from "@/components/common/navbar";
import { analyzeCV } from "@/services/api";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CVAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  useEffect(() => {
    const jobTitleParam = searchParams.get("jobTitle") || "";
    const jobDescriptionParam = searchParams.get("jobDescription") || "";
    setJobTitle(jobTitleParam);
    setJobDescription(jobDescriptionParam);
  }, [searchParams]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name);
        setPdfFile(file);
      } else {
        alert("Please upload a PDF file.");
        setFileName("");
        setPdfFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file before submitting.");
      return;
    }
    if (!jobTitle || !jobDescription) {
      toast.error("Please fill in the job title and job description before submitting.");
      return;
    }
    setIsLoading(true);
    try {
      const resultTemp = await analyzeCV(pdfFile, jobTitle, jobDescription);
      const resumeResult = JSON.stringify(resultTemp);
      localStorage.setItem("resume-result", resumeResult);
      localStorage.setItem("resume-details", JSON.stringify({ jobTitle, jobDescription }));
      navigate("result");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]"/>
      <div className="font-bold text-4xl text-center py-12 bg-primary-white text-primary-blue">Resume Grader</div>
      <div className="flex flex-row w-full justify-center px-24 py-12">
        <div className="h-full w-full max-w-[1200px] flex flex-col gap-6">
          {/* Job Title Input */}
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-xl text-primary-blue">Job title</div>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border-primary-blue text-lg border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
              placeholder="Job Title"
            />
          </div>

          {/* Job Description Input */}
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-xl text-primary-blue">Job description</div>
            <textarea
              ref={textareaRef}
              value={jobDescription}
              onChange={handleTextareaChange}
              className="max-h-96 min-h-56 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
              placeholder="Job Description"
            />
          </div>

          {/* File Upload Section */}
          <div className="flex flex-row w-full">
            <div className="flex flex-row justify-between items-center cursor-pointer px-8 py-6 bg-white  border-2 border-primary-blue w-full  rounded-lg text-start">
              <div className="font-semibold text-primary-blue text-xl text-ellipsis">{fileName ? fileName : "Upload your CV (PDF only)"}</div>
              <label htmlFor="fileUpload" className="flex items-center justify-center cursor-pointer py-4 px-6 bg-button-color text-white font-bold rounded-lg">
                Upload
              </label>
            </div>
            <input type="file" id="fileUpload" onChange={handleFileUpload} accept="application/pdf" className="hidden" />
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="bg-button-color text-white text-xl font-semibold py-3 px-6 rounded-lg mt-4">
            {isLoading ? (
              <div className="flex flex-row w-full justify-center items-center gap-2">
                <Loader2 className="animate-spin" />
                Analyzing...
              </div>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CVAnalyzer;
