// import EmotionChart from "@/components/chart/emotions";
// import AggregatedLineChart from "@/components/chart/voice";
// import { Emotion } from "@/types/emotion";
import ScoreChart from "@/components/chart/score";
import Navbar from "@/components/common/navbar";
import { getInterviewResult, getInterviewVideo } from "@/services/api";
import { AnalysisResult } from "@/types/analysis-result";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
// import Vid from "@/assets/placeholder/halo.mp4";


const InterviewAnalysisResult = () => {
  const [result, setResult] = useState<AnalysisResult>();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const tempVideo = await getInterviewVideo(id);
        const tempVideoUrl = URL.createObjectURL(tempVideo);
        
        if (tempVideoUrl) {
          setVideoUrl(tempVideoUrl);
        }
        const temp = await getInterviewResult(id);
        if (temp) {
          setResult(temp);
        }
      } catch (error) {
        console.error(error);
        navigate("/404"); // Redirect to a 404 page if an error occurs
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [id, navigate, videoUrl]);

  // If the result hasn't been fetched yet, return null or a loading spinner
  if (!result) return null;

  // const totalVideoLength = Math.floor(result.body.length / 4);

  return (
    <>
      <Navbar isHome={false} />
      <div className="h-[74px]"/>
      <div className="flex flex-col py-12 px-24 gap-12">
        <div className="text-4xl font-bold text-primary-blue">Interview Analysis Result</div>
        {/* Preview */}
        <div className="flex flex-row w-full justify-center">
      {loading ? ( // Show loading placeholder while fetching
        <div className="flex bg-primary-white w-96 h-48 justify-center items-center">
          <p>Loading video...</p>
        </div>
      ) : (
        videoUrl && (
          <ReactPlayer
          className="rounded-lg"
          url={videoUrl}
          playing={true}
          controls={true}
          />
        )
      )}

        </div>
        {/* chart */}
        <div className="flex flex-col gap-12">
          {/* <div className="flex flex-row items-cente gap-6 justify-between w-full">
            <div className="flex flex-col w-full items-center bg-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Engagement Over Time</h1>
              <AggregatedLineChart data={result.voice} data2={result.body} totalVideoLength={totalVideoLength} interval={2} />
            </div>
            <div className="flex flex-col w-full items-center bg-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Emotion Intensity Over Time</h1>
              <EmotionChart data={result.emotion as Emotion} />
            </div>
          </div> */}
          <div className="flex flex-row justify-center h-fit gap-24 w-[80%] mx-auto">
            <ScoreChart
              label="Relevance"
              value={result.relevance}
              description="indicating how relevant your answers were to the position you are applying for. A higher score means your answers were more pertinent to the job requirements."
            />
            <ScoreChart label="Clarity" value={result.clarity} description="representing how clear and understandable your answers were. This measures how well you communicate your points" />
            <ScoreChart label="Originality" value={result.originality} description="reflecting the uniqueness of your answer. This assesses how much your answers differed from standard or expected responses." />
            <ScoreChart
              label="Engagement"
              value={result.engagement}
              description="score that combines body language and emotional expression to evaluate how engaging you were. It reflects your overall presence and interaction during the interview."
            />
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col w-full bg-white rounded-lg max-w-[1200px] p-10 px-12 gap-4 h-fit">
          <h1 className="text-3xl font-bold">Analysis summary</h1>
          <div className="font-semibold text-justify text-lg">{result.summary}</div>
          <div className="font-semibold flex flex-col gap-2 text-lg">
            <h1 className="text-2xl font-bold">Improvement</h1>
            <div className="flex flex-col gap-4 list-outside">
              {result.improvement.map((item, index) => (
                <div key={index} className="flex flex-row gap-1">
                  <li />
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewAnalysisResult;
