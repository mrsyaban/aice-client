import Navbar from "@/components/common/navbar";
import Question from "@/components/questions/question";
import { getQuestionsByVacancy, getVacancyById } from "@/services/api";
import { Job } from "@/types/job";
import { QuestionType } from "@/types/question";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [vacancyInfo, setVacancyInfo] = useState<Job>();
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getQuestionsByVacancy(id)
      .then((res) => {
        setQuestions(res);
      })
      .catch((err) => {
        console.log(err);
      });

    getVacancyById(id)
      .then((res) => {
        setVacancyInfo(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <>
      <Navbar isHome={false} />
      <div className="h-[74px]"/>
      <div className="font-bold text-5xl text-center py-12 text-primary-blue bg-primary-white">Possible interview questions</div>
      <div className="h-full flex flex-col gap-8 py-14 max-w-[1200px] xl:mx-auto mx-12">
        <div className="flex w-full text-white font-bold text-3xl bg-primary-blue py-8 justify-center rounded-lg">{vacancyInfo?.title}</div>
        <div className="flex flex-col gap-4 w-full text-black font-normal text-lg bg-white py-8 px-6 rounded-lg">
          <p className={`whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-5 text-ellipsis"}`}>{vacancyInfo?.description}</p>
          {vacancyInfo?.description && vacancyInfo.description.length > 150 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary-blue underline font-semibold">
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-10 items-center h-fit ">
          {questions.map((question, index) => (
            <Question key={index} id={question.id} question={question.question} answer={question.example_answer} category={question.category}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default Questions;
