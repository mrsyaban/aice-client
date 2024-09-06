import { useNavigate } from "react-router-dom";

const Question = ({ question, answer }: { question: string; answer: string }) => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-12 items-start">
        <div className="text-3xl font-semibold text-justify w-full">{question}</div>
        <div onClick={() => navigate(`/interview?question=${question}`)} className="flex flex-col text-wrap bg-button-color cursor-pointer w-48 h-fit text-center text-white font-bold text-lg justify-center py-2 rounded-md">
            <span>practice</span>
            <span>interview</span> 
        </div>
      </div>
      <div className="text-2xl bg-[#e7e0ec] p-6 rounded-lg">{answer}</div>
    </div>
  );
};

export default Question;
