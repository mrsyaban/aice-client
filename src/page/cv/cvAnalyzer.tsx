import Navbar from "@/components/common/navbar";
import { analyzeCV, getCV, uploadCV } from "@/services/api";
import { useEffect, useState, useRef, ChangeEvent, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import { Industry } from "@/types/industry";
import { industriesData } from "@/utils/industry";
import { useDropzone } from "react-dropzone";

const CVAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [industry, setIndustry] = useState<SingleValue<{ value: number; label: string }> | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  
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

  useEffect(() => {
    const jobTitleParam = searchParams.get("jobTitle") || "";
    const jobDescriptionParam = searchParams.get("jobDescription") || "";
    setJobTitle(jobTitleParam);
    setJobDescription(jobDescriptionParam);
  }, [searchParams]);

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

  const handleSubmit = async () => {
    if (!fileName) {
      toast.error("Please upload a PDF file before submitting.");
      return;
    }
    if (!jobTitle || !jobDescription || !industry) {
      toast.error("Please fill in the job title, job description, and industry before submitting.");
      return;
    }
    setIsLoading(true);
    try {
      const resultTemp = await analyzeCV(jobTitle, jobDescription, industry?.label.toString());
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
      <div className="h-[74px]" />
      <div className="font-bold text-4xl text-center py-12 bg-primary-white text-primary-blue">Resume Grader</div>
      <div className="flex flex-row w-full justify-center px-24 py-12">
        <div className="h-full w-full max-w-[1200px] flex flex-col gap-6">
          {/* Job Title Input */}
          <div className="grid grid-cols-3 gap-x-8">
            <div className="flex flex-col col-span-2 gap-2">
              <div className="font-semibold text-base text-primary-blue">Job title</div>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border-primary-blue text-lg border-1 border rounded-md py-2 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                placeholder="ex: Software Engineer, Data Analyst, etc."
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="font-semibold text-base text-primary-blue">Company's industry</div>
              <Select className="h-full cursor-pointer " value={industry} onChange={(e) => setIndustry(e)} options={options} />
            </div>
          </div>

          {/* Job Description Input */}
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-base text-primary-blue">Job description</div>
            <textarea
              ref={textareaRef}
              value={jobDescription}
              onChange={handleTextareaChange}
              className="max-h-96 min-h-56 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
              placeholder="paste your detailed job description & job requirement here"
            />
          </div>

          {/* File Upload Section */}
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
