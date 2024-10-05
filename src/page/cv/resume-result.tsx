import ScoreBarChart from "@/components/chart/bar-score";
import Navbar from "@/components/common/navbar";
import { CvResult } from "@/types/cv-result";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import CheckIcon from "@/assets/icons/check-icon.svg";
import CrossIcon from "@/assets/icons/cross-icon.svg";
import { addVacancy } from "@/services/api";
import { Loader2 } from "lucide-react";

const ResumeResult = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [result, setResult] = useState<CvResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const resultTemp = localStorage.getItem("resume-result");
    if (resultTemp) {
      setResult(JSON.parse(resultTemp));
    }
    const resumeDetails = localStorage.getItem("resume-details");
    if (resumeDetails) {
      const { jobTitle, jobDescription, industry } = JSON.parse(resumeDetails);
      setJobTitle(jobTitle);
      setJobDescription(jobDescription);
      setIndustry(industry);
    }
  }, []);

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const vacancyId = await addVacancy(jobTitle, jobDescription, industry);
      navigate(`/questions/${vacancyId}`);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]" />
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
            <div onClick={() => navigate("/cv-analyzer")} className="flex flex-row w-full bg-button-color justify-center font-bold text-white text-2xl py-4 px-6 rounded-lg cursor-pointer hover:scale-105">
              Analyze another job
            </div>
          </div>
          {/* result */}
          {result && (
            <div className="flex flex-col gap-6 w-[65%]">
              {/* <div className="font-bold text-4xl text-left text-primary-blue">Analysis</div> */}
              <ScoreBarChart value={result.relevanceScore} label="Job fitness Score" desc="How well your resume fit with the job requirements" />
              <Table className="border-4 border-white rounded-lg text-primary-purpleLight text-md">
                <TableBody>
                  {result.judgements.map((judgement, index) => (
                    <TableRow key={index} className="border-b-4 border-white">
                      <TableCell className="font-medium pl-4">{judgement.requirement}</TableCell>
                      <TableCell className="text-right pr-8">{judgement.isFit ? <img src={CheckIcon} alt="fit" className="h-6 w-6" /> : <img src={CrossIcon} alt="not-fit" className="h-6 w-6" />}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {result.relevanceScore < 80 && <div className="text-lg font-semibold text-[#c0322a]">Your resume is not fit with the job requirements. Please consider improving your resume instead of start practicing interview.</div>}
              <div onClick={handleGenerateQuestions} className="self-start cursor-pointer bg-primary-blue text-white text-lg py-2 px-4 rounded-lg font-semibold">
                {isLoading ? (
                  <div className="text-slate-400 flex flex-row items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                    Generating questions...
                  </div>
                ) : (
                  "Generate interview questions"
                )}
              </div>
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
                <h1 className="text-3xl font-bold">Summary of analysis</h1>
                <div className="font-normal text-justify text-lg">{result.summary}</div>
                <div className="font-semibold flex flex-col gap-2 text-lg">
                  <h1 className="text-3xl font-bold">Improvement recommendation</h1>
                  <div className="flex flex-col gap-4 list-outside ">
                    {result.improvement.map((item: string, index: number) => (
                      <div key={index} className="flex flex-row gap-1 font-normal">
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
