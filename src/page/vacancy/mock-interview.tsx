import { useNavigate } from "react-router-dom";
import Navbar from "@/components/common/navbar";
import { useState } from "react";
import { addVacancy } from "@/services/api";
import { Loader2 } from "lucide-react";

const AIMockInterview = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuestions = async () => {
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

  return (
    <div className="h-screen w-full bg-primary-white">
      <Navbar isHome={false} />
      <div className="flex flex-col gap-16 items-center h-fit pt-12">
        <div className="flex flex-col h-fit gap-8 items-center">
          <div className="text-4xl font-bold text-primary-blue">Paste your job posting here!</div>
          <input
            type="text"
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-[640px] border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Title"
          />
          <textarea
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-[640px] border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Description"
          />
          {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
          <div className="flex flex-row gap-6">
            <button onClick={handleGenerateQuestions} disabled={isLoading} className="py-5 px-8 hover:opacity-90 cursor-pointer bg-button-color flex items-center justify-center text-white rounded-lg font-bold disabled:opacity-50">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get interview questions"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMockInterview;
