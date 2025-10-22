import { useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const [inputs, setInputs] = useState({
    shape: "Hexagonal",
    solarRadiation: 711, // W/m²
    collectorArea: 1.1,  // m²
    massFlowRate: 0.02,  // kg/s
    velocity: 0.5,       // m/s
    inletTemp: 27,       // °C
    outletTemp: 67,      // °C
    ambientTemp: 28,     // °C
    nusselt: 10,         // Nu number
    distance: 0.16       // m
  });

  const [outputs, setOutputs] = useState({
    Qout: 0,
    Qloss: 0,
    Efficiency: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: name === "shape" ? value : parseFloat(value),
    });
  };

  const handlePredict = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (data.predicted_values) {
        const [Qout, Qloss, Efficiency] = data.predicted_values;
        setOutputs({ Qout, Qloss, Efficiency });
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed! Check your backend or input values.");
    }
  };

  return (
    <>
      <PageMeta
        title="Solar Thermal Performance Dashboard | Smart Energy Monitor"
        description="Dashboard visualizing solar collector performance metrics and efficiency trends."
      />

      <div className="p-6 space-y-6">
        <div className="flex justify-center">
          <div className="w-full md:w-10/12 lg:w-8/12">
            <EcommerceMetrics data={outputs} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
              <MonthlySalesChart />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
              <StatisticsChart />
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4 flex justify-center">
            <div className="w-11/12 lg:w-10/12 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 pr-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
                Input Parameters
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <div className="flex flex-col items-center text-center">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Shape
                  </label>
                  <select
                    name="shape"
                    value={inputs.shape}
                    onChange={handleChange}
                    className="w-3/4 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 dark:text-white text-center"
                  >
                    <option value="Hexagonal">Hexagonal</option>
                    <option value="Circular">Circular</option>
                    <option value="Triangular">Triangular</option>
                  </select>
                </div>

                {Object.entries(inputs).map(([key, value]) =>
                  key !== "shape" ? (
                    <div key={key} className="flex flex-col items-center text-center">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {key}
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={`Typical: ${value}`}
                        className="w-3/4 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 dark:text-white text-center appearance-none"
                      />
                    </div>
                  ) : null
                )}
              </div>

              <button
                onClick={handlePredict}
                className="mt-6 w-3/4 mx-auto block bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Predict Performance
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
