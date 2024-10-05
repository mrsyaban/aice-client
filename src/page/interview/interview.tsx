import { useState, useEffect } from "react";
import Navbar from "@/components/common/navbar";
import { useSearchParams } from "react-router-dom";
import { getInterviewById } from "@/services/api";
import { Toaster } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadVideo from "@/components/interview/upload-video/upload-video";
import VideoRecorder from "@/components/interview/upload-video/record-video";

import MicIcon from "@/assets/icons/mic.svg";
import SilentIcon from "@/assets/icons/silent.svg";
import LampIcon from "@/assets/icons/lamp.svg";


const Interview = () => {
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState<string>("");
  const [questionId, setQuestionId] = useState<string>("");

  useEffect(() => {
    const questionId = searchParams.get("id") || "";
    setQuestionId(questionId);

    const questionTemp = searchParams.get("question") || "";
    if (questionTemp) {
      setQuestion(questionTemp);
    }

    if (!questionId) return;
    getInterviewById(questionId)
      .then((question) => {
        setQuestion(question.question);
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
      });
  }, [searchParams]);

  return (
    <div>
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]" />
      <div className="text-4xl font-bold bg-primary-white text-center w-full py-12 text-primary-blue">Interview Grader</div>
      <div className="flex flex-row px-24 w-full justify-center">
        <div className="flex flex-col gap-4 py-12 w-full max-w-[1200px]">
          <textarea
            placeholder="Put your interview question here"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              e.target.style.height = "auto"; // Reset height to auto to shrink if needed
              e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to content
            }}
            className="flex h-fit w-full items-center text-primary-blue resize-none focus:outline-none font-semibold text-3xl bg-transparent rounded-lg"
          />
          <div className="flex flex-col gap-2 text-primary-blue w-full p-4 py-4 border-2 border-opacity-45 border-primary-blue rounded-lg bg-primary-blue bg-opacity-15">
            <span className="font-bold">Before we can analyze your recorded answers, please ensure these conditions are met as we are going to grade your answer based on the following components:</span>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-row gap-2 items-center">
                <img src={MicIcon} alt="mic" className="w-6 h-6" /> 
                <span className="font-bold">Content of your answer. </span>Make sure you are speaking clearly into the microphone.
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={SilentIcon} alt="silent" className="w-6 h-6" />
                <span className="font-bold">Voice clarity. </span>
                Avoid background noise and crowded places.
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={LampIcon} alt="lamp" className="w-6 h-6" />
                <span className="font-bold">Body language and movement. </span>
                Record your answers in a well-lit room as we are going to analyze your expressions and non-verbal movements as well.
              </div>
            </div>
          </div>
          <Tabs defaultValue="record" className="w-full mt-6 bg-transparent rounded-lg bg-white">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border bg-gray-600 rounded-b-none border-black h-fit">
              <TabsTrigger value="record" className="text-2xl font-bold text-white">
                Record
              </TabsTrigger>
              <TabsTrigger value="upload" className="text-2xl font-bold text-white">
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="record" className="bg-transparent flex justify-center py-12">
              <VideoRecorder question={question} questionId={questionId} />
            </TabsContent>
            <TabsContent value="upload" className="p-4 justify-center">
              <UploadVideo question={question} questionId={questionId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Interview;
