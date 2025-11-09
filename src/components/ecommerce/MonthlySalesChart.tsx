import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";

interface HeatOutputChartProps {
  data: { Qout: number; Qloss: number; Efficiency: number };
}

export default function HeatOutputChart({ data }: HeatOutputChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [series, setSeries] = useState([
    {
      name: "Qout (Heat Output)",
      data: Array(12).fill(0),
      color: "#F59E0B", // 🟧 solar orange tone
    },
  ]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // 🔸 Update chart dynamically whenever new Qout arrives
  useEffect(() => {
    const baseQout = data.Qout || 0;

    // Realistic heating curve (gradual rise)
    const heatProfile = Array.from({ length: 12 }, (_, i) =>
      parseFloat((baseQout * (1 - Math.exp(-i / 4))).toFixed(2))
    );

    setSeries([
      {
        name: "Qout (Heat Output)",
        data: heatProfile,
        color: "#F59E0B", // ensures same color always
      },
    ]);
  }, [data]);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
    },
    colors: ["#F59E0B"], // 🔸 fixed solar orange
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: [
        "0s",
        "10s",
        "20s",
        "30s",
        "40s",
        "50s",
        "60s",
        "70s",
        "80s",
        "90s",
        "100s",
        "110s",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: "Time (s)",
        style: { color: "#9CA3AF", fontSize: "13px" },
      },
      labels: { style: { colors: "#9CA3AF" } },
    },
    yaxis: {
      min: 0,
      title: {
        text: "Qout (W)",
        style: { color: "#9CA3AF", fontSize: "13px" },
      },
      labels: { style: { colors: "#9CA3AF" } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "#9CA3AF" },
    },
    grid: {
      borderColor: "rgba(156, 163, 175, 0.2)",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: {
      opacity: 0.95,
      colors: ["#F59E0B"], // 🔸 lock color again to solar orange
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val.toFixed(2)} W`,
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* ===== Header Section ===== */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Heat Output Over Time (Qout)
        </h3>
        <div className="relative inline-block">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* ===== Chart Section ===== */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
