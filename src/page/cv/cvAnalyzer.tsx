import ScoreBarChart from "@/components/chart/bar-score";
import Navbar from "@/components/common/navbar";
import { analyzeCV } from "@/services/api";
import { CvResult } from "@/types/cv-result";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


const CVAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<CvResult | null>(null);
  const [searchParams] = useSearchParams();

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
      setResult(resultTemp);
      console.log(resultTemp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="flex flex-row w-full px-12 gap-12 py-12">
        <div className="h-full w-[40%] flex flex-col gap-8 ">
          <div className="font-bold text-4xl text-center  text-primary-blue">Analyze your resume!</div>

          {/* Job Title Input */}
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Title"
          />

          {/* Job Description Input */}
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-72 text-start border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Description"
          />

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
                Loading...
              </div>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
        {/* result */}
        {result && (
          <div className="flex flex-col gap-6 w-[60%]">
            <ScoreBarChart value={result.RelevanceScore} label="Relevance Score" desc="indicating how well your resume aligns with the job requirements" />
            <ScoreBarChart value={result.quantifiedScore} label="Quantification Score" desc="indicating the level of quantification in the resume"/>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col rounded-lg gap-2 w-[50%] bg-white p-4">
                <div className="text-xl font-bold">Jobs keywords</div>
                <div className="flex flex-wrap">
                  {result.jobsKeywords?.map((keyword: string, index: number) => (
                    <div key={index} className="bg-primary-blue text-white rounded-lg py-2 px-4 m-1">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-lg gap-2 w-[50%] bg-white p-4">
                <div className="text-xl font-bold">Your resume keywords</div>
                <div className="flex flex-wrap">
                  {result.resumeKeywords?.map((keyword: string, index: number) => (
                    <div key={index} className="bg-primary-blue text-white rounded-lg py-2 px-4 m-1">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full bg-white rounded-lg p-10 px-12 gap-4 h-fit">
              <h1 className="text-3xl font-bold">Summary of Analysis</h1>
              <div className="font-semibold text-justify text-lg">{result.summary}</div>
              <div className="font-semibold flex flex-col gap-2 text-lg">
                <h1 className="text-2xl font-bold">Improvement</h1>
                <div className="flex flex-col gap-4 list-outside">
                  {result.improvement.map((item: string, index: number) => (
                    <div key={index} className="flex flex-row gap-1">
                      <li />
                      <div>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CVAnalyzer;
