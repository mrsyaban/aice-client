import { useNavigate } from "react-router-dom";

const Question = ({ question, answer, id }: { question: string; answer: string; id:string }) => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-lg">
      <div className="flex flex-row justify-between gap-12 items-start">
        <div className="text-2xl font-semibold text-justify w-full">{question}</div>

      </div>
      <div className="text-2xl bg-[#e7e0ec] p-6 rounded-lg">{answer}</div>
      <div onClick={() => navigate(`/interview?id=${id}`)} className="flex flex-col text-wrap bg-button-color self-end cursor-pointer w-56 h-fit text-center text-white font-bold text-lg justify-center py-2 rounded-md">
            <span>practice interview</span>
        </div>
    </div>
  );
};

export default Question;
