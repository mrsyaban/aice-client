import { Axios } from "./http";

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
  return res.data;
}

export async function getInterviewVideo(questionId: string | undefined) {
  if (!questionId) return [];
  const res = await Axios.get(`/stream/${questionId}`,{}, {
    responseType: "blob",
  });
  return res.data;
}

// cv
export async function analyzeCV(cv: File, jobTitle: string, jobDescription: string) {
  const formData = new FormData();
  formData.append("file", cv);
  formData.append("job_title", jobTitle);
  formData.append("description", jobDescription);
  const res = await Axios.post(`/cv`, formData);
  return res.data;
}
