import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

interface HeatLossChartProps {
  data: { Qout: number; Qloss: number; Efficiency: number };
}

export default function HeatLossChart({ data }: HeatLossChartProps) {
  const [series, setSeries] = useState([
    { name: "Qloss (Heat Loss)", data: Array(8).fill(0) },
    { name: "Net Useful Heat (Qout - Qloss)", data: Array(8).fill(0) },
  ]);

  // 🔥 Update chart dynamically when predicted values change
  useEffect(() => {
    const baseQloss = data.Qloss || 0;
    const baseQout = data.Qout || 0;
    const netUseful = Math.max(baseQout - baseQloss, 0);

    // 8 time points
    const timePoints = Array.from({ length: 8 }, (_, i) => i * 10);

    // Gradual profiles (similar look to your static version)
    const qlossProfile = timePoints.map((_, i) =>
      parseFloat((baseQloss * (0.85 + 0.02 * i)).toFixed(2))
    );
    const netUsefulProfile = timePoints.map((_, i) =>
      parseFloat((netUseful * (0.9 + 0.015 * i)).toFixed(2))
    );

    setSeries([
      { name: "Qloss (Heat Loss)", data: qlossProfile },
      { name: "Net Useful Heat (Qout - Qloss)", data: netUsefulProfile },
    ]);
  }, [data]);

  const options: ApexOptions = {
    legend: { show: true, position: "top", labels: { colors: "#6B7280" } },
    colors: ["#EF4444", "#FCA5A5"], // ❤️ Same red shades as original
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
      },
    },
    stroke: { curve: "smooth", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val.toFixed(2)} W`,
      },
    },
    xaxis: {
      type: "category",
      categories: ["0s", "10s", "20s", "30s", "40s", "50s", "60s", "70s"],
      title: {
        text: "Time (s)",
        style: { color: "#6B7280", fontSize: "13px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9CA3AF" } },
    },
    yaxis: {
      title: {
        text: "Qloss (W)",
        style: { color: "#6B7280", fontSize: "13px" },
      },
      labels: { style: { colors: "#9CA3AF" } },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Heat Loss Over Time (Qloss)
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Comparison of heat loss and net useful heat over time
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
