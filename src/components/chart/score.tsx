import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreChart = ({ label, value }: { label: string; value: number }) => {
  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [value, 1 - value],
        backgroundColor: ["#4A90E2", "#E0E0E0"],
        borderColor: ["#4A90E2", "#E0E0E0"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (tooltipItem: any) => `${tooltipItem.label}: ${(tooltipItem.raw * 100).toFixed(1)}%`,
        },
    },
    legend: {
        display: false,
    },
    datalabels: {
        display: false,
    },
      // Custom plugin added here
      centerText: {
        id: 'centerText',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        beforeDraw: (chart: any) => {
            const { ctx, chartArea } = chart;
            const { width, height, top, left } = chartArea;
            
            // Calculate center coordinates
            const centerX = (width - left) / 2 + left;
            const centerY = (height - top) / 2 + top;
            
            // Check if width and height are valid
            if (width && height) {
                ctx.save();
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#4A90E2"; // Text color
            ctx.fillText(`${(value * 100).toFixed(1)}%`, centerX, centerY);
            ctx.restore();
          }
        },
      },
    },
    cutout: "70%", // Adjust the inner radius for donut effect
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="p-2 w-full">
        <Doughnut
          data={data}
          options={options}
          style={{
            width: "100%",
            height: "100%",
          }}
          plugins={[options.plugins.centerText]}
        />
      </div>
      <div>
        <div className="text-lg font-bold text-primary-blue text-center">{label}</div>
      </div>
    </div>
  );
};

export default ScoreChart;
