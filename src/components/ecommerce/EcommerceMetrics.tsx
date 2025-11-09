import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SunIcon,
  ThermometerIcon,
  GaugeIcon,
} from "lucide-react";
import Badge from "../ui/badge/Badge";

interface SolarMetricsProps {
  data?: { Qout: number; Qloss: number; Efficiency: number };
}

export default function SolarMetrics({
  data = { Qout: 0, Qloss: 0, Efficiency: 0 },
}: SolarMetricsProps) {
  const [previousData, setPreviousData] = useState(data);
  const [trend, setTrend] = useState({
    Qout: 0,
    Qloss: 0,
    Efficiency: 0,
  });

  useEffect(() => {
    if (
      previousData.Qout !== 0 ||
      previousData.Qloss !== 0 ||
      previousData.Efficiency !== 0
    ) {
      const newTrend = {
        Qout:
          previousData.Qout !== 0
            ? ((data.Qout - previousData.Qout) / previousData.Qout) * 100
            : 0,
        Qloss:
          previousData.Qloss !== 0
            ? ((data.Qloss - previousData.Qloss) / previousData.Qloss) * 100
            : 0,
        Efficiency:
          previousData.Efficiency !== 0
            ? ((data.Efficiency - previousData.Efficiency) /
                previousData.Efficiency) *
              100
            : 0,
      };
      setTrend(newTrend);
    }
    setPreviousData(data);
  }, [data]);

  const renderTrend = (value: number) => {
    const allZero =
      data.Qout === 0 && data.Qloss === 0 && data.Efficiency === 0;

    if (allZero) {
      return (
        <span className="px-2 py-1 rounded-lg text-gray-400 bg-gray-100 dark:bg-gray-800 text-xs">
          —
        </span>
      );
    }
    if (value > 0)
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 text-xs font-medium">
          <ArrowUpIcon className="w-3 h-3" /> +{value.toFixed(1)}%
        </span>
      );
    if (value < 0)
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 text-xs font-medium">
          <ArrowDownIcon className="w-3 h-3" /> {value.toFixed(1)}%
        </span>
      );
    return (
      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300 text-xs">
        0.0%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Qout */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-800/30">
          <SunIcon className="text-blue-600 size-6 dark:text-blue-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Qout (W)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 transition-all duration-300">
              {data.Qout.toFixed(2)}
            </h4>
          </div>
          {renderTrend(trend.Qout)}
        </div>
      </div>

      {/* Qloss */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-800/30">
          <ThermometerIcon className="text-red-600 size-6 dark:text-red-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Qloss (W)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 transition-all duration-300">
              {data.Qloss.toFixed(2)}
            </h4>
          </div>
          {renderTrend(trend.Qloss)}
        </div>
      </div>

      {/* Efficiency */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-800/30">
          <GaugeIcon className="text-green-600 size-6 dark:text-green-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Efficiency (%)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 transition-all duration-300">
              {data.Efficiency.toFixed(2)}
            </h4>
          </div>
          {renderTrend(trend.Efficiency)}
        </div>
      </div>
    </div>
  );
}
