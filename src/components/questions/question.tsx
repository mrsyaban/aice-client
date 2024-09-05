import { useNavigate } from "react-router-dom";

const Question = ({ question, answer }: { question: string; answer: string }) => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="text-4xl font-semibold">{question}</div>
        <div onClick={() => navigate(`/interview?question=${question}`)} className="flex bg-button-color cursor-pointer text-white font-bold text-lg justify-center py-2 rounded-md px-6">
            practice interview with this question
        </div>
      </div>
      <div className="text-2xl bg-[#e7e0ec] p-6 rounded-lg">{answer}</div>
    </div>
  );
};

export default Question;
