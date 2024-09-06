import { Axios } from "./http";

export async function reset() {
  const res = await Axios.get(`/reset`);
  return res.data;
}

// vacancy
export async function getVacancies() {
  const res = await Axios.get(`/vacancy`);
  return res.data;
}

export async function getVacancyById(vacancyId: string) {
  const res = await Axios.get(`/vacancy/${vacancyId}`);
  return res.data;
}

export async function getQuestionsByVacancy(vacancyId: string) {
  const res = await Axios.get(`/question-by-vacancy/${vacancyId}`);
  return res.data;
}

export async function addVacancy(jobTitle: string, jobDescription: string) {
  const res = await Axios.post(`/vacancy`, {
    title: jobTitle,
    description: jobDescription,
  });
  return res.data;
}

// interview
export async function getInterviews() {
  const res = await Axios.get(`/questions`);
  return res.data;
}

export async function getInterviewById(interviewId: string) {
  const res = await Axios.get(`/question/${interviewId}`);
  return res.data;
}

export async function addInterview(question: string, interviewVideo: string) {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/question`, formData);
  return res.data;
}

export async function getInterviewResult(vacancyId: string) {
  const res = await Axios.get(`/question-result/${vacancyId}`);
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
