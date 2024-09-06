// src/components/EmotionChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Emotion } from '@/types/emotion';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const EmotionChart = ({ data }:{data: Emotion}) => {
//   // Count the occurrences of each emotion intensity (3 = sad, 4 = neutral, 6 = happy)
//   const emotionCounts = {
//     sad: data.filter((value) => value === 3).length,
//     neutral: data.filter((value) => value === 4).length,
//     happy: data.filter((value) => value === 6).length,
//   };

//   // Calculate percentage
//   const total = data.length;
//   const percentages = {
//     sad: (emotionCounts.sad / total) * 100,
//     neutral: (emotionCounts.neutral / total) * 100,
//     happy: (emotionCounts.happy / total) * 100,
//   };

  // Prepare chart data
  console.log(data);
  const chartData = {
    labels: ['Anger', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness', 'Surprise'],
    datasets: [
      {
        label: 'Emotion Percentage',
        data: [
          data.angry * 100,
          data.disgust * 100,
          data.fear * 100,
          data.happy * 100,
          data.neutral * 100,
          data.sad * 100,
          data.surprise * 100,
        ],
        backgroundColor: ['#471f59', '#bdbdbd', '#3450b6'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // This makes the bar chart horizontal
    scales: {
      x: {
        title: {
          display: true,
          text: 'Percentage (%)',
        },
        beginAtZero: true,
        max: 100,
      },
      y: {
        title: {
          display: true,
          text: 'Emotion',
        },
      },
    },
  };

  return (
    <div className="p-4 w-full">
      <Bar 
        data={chartData} 
        options={options} 
        className='aspect-square'
        style={{
          width: '100%',
          height: '200%',
        }}/>
    </div>
  );
};

export default EmotionChart;
