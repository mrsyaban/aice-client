import ScoreBarChart from "@/components/chart/bar-score";
import Navbar from "@/components/common/navbar";
import { CvResult } from "@/types/cv-result";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ResumeResult = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [result, setResult] = useState<CvResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const resultTemp = localStorage.getItem("resume-result");
    if (resultTemp) {
      setResult(JSON.parse(resultTemp));
    }
    const resumeDetails = localStorage.getItem("resume-details");
    if (resumeDetails) {
      const { jobTitle, jobDescription } = JSON.parse(resumeDetails);
      setJobTitle(jobTitle);
      setJobDescription(jobDescription);
    }
  }, []);

  return (
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]"/>
      <div className="font-bold text-4xl text-center py-12 bg-primary-white text-primary-blue">Resume Analysis Result</div>
      <div className="flex px-24">
        <div className="flex flex-row w-full px-12 gap-24 py-12">
          <div className="h-full w-[35%] flex flex-col gap-8 ">
            <div className="font-bold text-4xl text-left text-gray-500">Job details</div>
            <div className="flex w-full text-gray-500 font-bold text-3xl bg-white py-6 px-8 justify-center rounded-lg">{jobTitle}</div>
            <div className="flex flex-col gap-4 w-full text-gray-400 font-normal text-lg bg-white py-8 px-6 rounded-lg">
              <p className={`whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-[15] text-ellipsis"}`}>{jobDescription}</p>
              {jobDescription && jobDescription.length > 150 && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary-blue underline font-semibold">
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>
            <div className="flex flex-row w-full bg-button-color justify-center font-bold text-white text-2xl py-4 px-6 rounded-lg cursor-pointer hover:scale-105">Analyze another resume</div>
          </div>
          {/* result */}
          {result && (
            <div className="flex flex-col gap-6 w-[65%]">
              {/* <div className="font-bold text-4xl text-left text-primary-blue">Analysis</div> */}
              <ScoreBarChart value={result.RelevanceScore} label="Relevance Score" desc="How well your resume aligns with the job requirements" />
              <ScoreBarChart value={result.quantifiedScore} label="Quantification Score" desc="How much quantification that justifies your achievements" />
              <div className="flex flex-row gap-6">
                <div className="flex flex-col rounded-lg gap-2 w-[50%] bg-white p-4">
                  <div className="text-xl font-bold">Jobs keywords</div>
                  <div className="flex flex-wrap">
                    {result.jobKeywords?.map((keyword: string, index: number) => (
                      <div key={index} className="bg-primary-purpleLight bg-opacity-10 text-primary-purpleLight font-semibold rounded-lg py-2 px-4 m-1">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col rounded-lg gap-2 w-[50%] bg-white p-4">
                  <div className="text-xl font-bold">Your resume keywords</div>
                  <div className="flex flex-wrap">
                    {result.resumeKeywords?.map((keyword: string, index: number) => (
                      <div key={index} className="bg-primary-purpleLight bg-opacity-10 text-primary-purpleLight font-semibold rounded-lg py-2 px-4 m-1">
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
      </div>
    </>
  );
};

export default ResumeResult;
