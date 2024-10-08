import { emotionGroups } from "@/types/emotion";
import { Axios } from "./http";
import { PhraseAnalysis } from "@/types/analysis-result";
import { CvResult } from "@/types/cv-result";

export async function userLogin() {
  await Axios.get(`/login`);
}

export async function reset() {
  const res = await Axios.get(`/reset`);
  return res.data;
}

// vacancy
export async function getVacancies() {
  const res = await Axios.get(`/vacancy`);
  return res.data.vacancies;
}

export async function getVacancyById(vacancyId: string | undefined) {
  if (!vacancyId) return null;
  const res = await Axios.get(`/vacancy/${vacancyId}`);
  return res.data;
}

export async function getQuestionsByVacancy(vacancyId: string | undefined) {
  if (!vacancyId) return [];
  const res = await Axios.get(`/questions-by-vacancy/${vacancyId}`);
  return res.data.questions;
}

export async function addVacancy(jobTitle: string, jobDescription: string, jobIndustry: string) {
  const res = await Axios.post(`/vacancy`, {
    title: jobTitle,
    description: jobDescription,
    industry: jobIndustry,
  });
  return res.data.id;
}

// interview
export async function getInterviews() {
  const res = await Axios.get(`/questions`);
  return res.data.questions;
}

export async function getInterviewById(interviewId: string) {
  const res = await Axios.get(`/question/${interviewId}`);

  return res.data;
}

export async function addInterview(question: string, interviewVideo: File) {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/question`, formData);
  return res.data.message;
}

export async function addInterviewById(questionId: string, interviewVideo: File) {
  const formData = new FormData();
  formData.append("id", questionId);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/answer-question`, formData);
  return res.data.message;
}

export async function getInterviewResult(vacancyId: string | undefined) {
  if (!vacancyId) return [];
  const res = await Axios.get(`/question-result/${vacancyId}`);

  function isSameEmotionGroup(emotion: string, actual_emotion: string): boolean {
    const isInGroup1 = emotionGroups.group1.includes(emotion) && emotionGroups.group1.includes(actual_emotion);
    const isInGroup2 = emotionGroups.group2.includes(emotion) && emotionGroups.group2.includes(actual_emotion);
    return isInGroup1 || isInGroup2;
  }

  function approvePhrase(phraseData: PhraseAnalysis): PhraseAnalysis {
    const gestureApproved = phraseData.gesture === phraseData.actual_gesture;
    const emotionApproved = isSameEmotionGroup(phraseData.emotion, phraseData.actual_emotion);

    return {
      ...phraseData,
      approved: gestureApproved && emotionApproved,
    };
  }

  const result = res.data.result;
  return {
    ...res.data,
    result: result.map(approvePhrase),
  };
}

export async function getInterviewVideo(questionId: string | undefined) {
  if (!questionId) return [];
  const res = await Axios.get(
    `/stream/${questionId}`,
    {},
    {
      responseType: "blob",
    }
  );
  return res.data;
}

// cv
export async function getCV() {
  const res = await Axios.get(`/cv`);
  return res.data;
}

export async function uploadCV(cv: File) {
  const formData = new FormData();
  formData.append("file", cv);
  const res = await Axios.post(`/cv`, formData);
  return res.data;
}

export async function analyzeCV(jobTitle: string, jobDescription: string, industry: string) {
  const res = await Axios.post(`/analyze-cv`, {
    title: jobTitle,
    description: jobDescription,
    industry: industry,
  });
  const result: CvResult = res.data;
  return {
    ...result,
    relevanceScore: (result.judgements.filter((judgement) => judgement.isFit).length / result.judgements.length) * 100,
  };
}
