export interface Emotion {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  neutral: number;
  sad: number;
  surprise: number;
}

export const emotionGroups = {
  group1: ['happy', 'neutral', 'surprised'],
  group2: ['sad', 'disgust', 'angry', 'fear'],
};