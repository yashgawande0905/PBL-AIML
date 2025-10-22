import { ArrowUpIcon, ArrowDownIcon, SunIcon, ThermometerIcon, GaugeIcon } from "lucide-react";
import Badge from "../ui/badge/Badge";

interface SolarMetricsProps {
  data?: { Qout: number; Qloss: number; Efficiency: number };
}

export default function SolarMetrics({ data = { Qout: 0, Qloss: 0, Efficiency: 0 } }: SolarMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Qout */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-800/30">
          <SunIcon className="text-blue-600 size-6 dark:text-blue-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Qout (W)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{data.Qout.toFixed(2)}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> +4.2%
          </Badge>
        </div>
      </div>

      {/* Qloss */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-800/30">
          <ThermometerIcon className="text-red-600 size-6 dark:text-red-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Qloss (W)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{data.Qloss.toFixed(2)}</h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon /> -2.5%
          </Badge>
        </div>
      </div>

      {/* Efficiency */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-800/30">
          <GaugeIcon className="text-green-600 size-6 dark:text-green-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Efficiency (%)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{data.Efficiency.toFixed(2)}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> +3.1%
          </Badge>
        </div>
      </div>
    </div>
  );
}
