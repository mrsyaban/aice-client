import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressBar = ({ label, value, desc }: { label: string; value: number; desc: string }) => {
  value = value > 10 ? value * 0.01 : value * 0.1;

  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [value, 1 - value],
        backgroundColor: ["#5d70ef", "#E0E0E0"],
        borderColor: ["#5d70ef", "#E0E0E0"],
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
      centerText: {
        id: "centerText",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        beforeDraw: (chart: any) => {
          const { ctx, chartArea } = chart;
          const { width, height, top, left } = chartArea;

          const centerX = (width - left) / 2 + left;
          const centerY = (height - top) / 2 + top;

          if (width && height) {
            ctx.save();
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#524EC6"; // Text color
            ctx.fillText(`${(value * 100).toFixed(1)}%`, centerX, centerY);
            ctx.restore();
          }
        },
      },
    },
    cutout: "80%",
  };

  return (
    <div className="flex flex-row bg-white items-center w-full gap-4 p-4 px-8 rounded-lg">
      <div className="flex flex-col items-start w-full text-lg">
        <span className="font-bold text-2xl text-primary-purpleLight">{label}</span>
        <span className="font-normal text-primary-purpleLight">{desc}</span>
      </div>
      <div className="p-2 h-full max-h-24">
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
      {/* <div className="w-full flex flex-row gap-8">
        <div className="w-full flex flex-row items-center bg-primary-white rounded-full h-6">
          <div className="bg-primary-blue h-6 rounded-full" style={{ width: `${value>10 ? value : value * 10}%` }} />
        </div>
        <span className="font-bold text-primary-blue">{(value>10 ? value : value * 10).toFixed(1)}%</span>
      </div> */}
    </div>
  );
};

export default ProgressBar;
