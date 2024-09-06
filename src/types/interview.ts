export interface Interview {
  id: string;
  question: string;
  video: string;
  status: InterviewStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum InterviewStatus {
  SUCCESS = "SUCCESS",
  Analyzing = "analyzing",
}
