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
    <div>
      <Navbar isHome={false} />
      <div className="h-full flex flex-col gap-8 py-8 max-w-[1200px] xl:mx-auto mx-12">
        <div className="font-bold text-4xl text-center pt-10 text-primary-blue">Possible interview questions</div>
        <div className="flex w-full text-white font-bold text-3xl bg-primary-blue py-8 justify-center rounded-lg">{vacancyInfo?.title}</div>
        <div className="flex flex-col gap-10 items-center h-fit ">
          {questions.map((question, index) => (
            <Question key={index} question={question.question} answer={question.example_answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
