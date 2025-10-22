import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";

export default function HeatOutputChart() {
  const options: ApexOptions = {
    colors: ["#F59E0B"], // solar yellow/orange
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "0s", "10s", "20s", "30s", "40s", "50s", "60s",
        "70s", "80s", "90s", "100s", "110s",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: "Time (s)",
        style: { color: "#6B7280", fontSize: "13px" },
      },
    },
    legend: { show: true, position: "top", horizontalAlign: "left" },
    yaxis: {
      title: {
        text: "Qout (W)",
        style: { color: "#6B7280", fontSize: "13px" },
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => `${val} W` },
    },
  };

  const series = [
    {
      name: "Qout (Heat Output)",
      data: [180, 200, 210, 230, 250, 270, 260, 280, 300, 310, 295, 285],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
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
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
