import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";

export default function Home() {
  const [inputs, setInputs] = useState({
    shape: "Hexagonal",
    solarRadiation: 711,
    collectorArea: 1.1,
    massFlowRate: 0.02,
    velocity: 0.5,
    inletTemp: 27,
    outletTemp: 67,
    ambientTemp: 28,
    nusselt: 10,
    distance: 0.16,
  });

  const [outputs, setOutputs] = useState({
    Qout: 0,
    Qloss: 0,
    Efficiency: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "shape" ? value : parseFloat(value),
    }));
  };

  const handlePredict = async () => {
    const API_URL = "https://pbl-aiml-2aq3.onrender.com/predict";
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("⚠️ Backend returned invalid JSON response.");
        return;
      }

      if (!res.ok) {
        alert(`❌ ${data.error || "Backend error occurred."}`);
        return;
      }

      const predicted = data.predicted_values;
      if (predicted) {
        setOutputs({
          Qout: predicted["Qout"],
          Qloss: predicted["Qloss"],
          Efficiency: predicted["Efficiency(%)"],
        });

        alert(
          `✅ Prediction Successful!\n\nQout: ${predicted.Qout}\nQloss: ${predicted.Qloss}\nEfficiency: ${predicted["Efficiency(%)"]}%`
        );
      } else {
        alert("⚠️ Unexpected response format from backend.");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("⚠️ Prediction failed! Please check your network or backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Solar Thermal Performance Dashboard"
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
                    <option value="Flat">Flat</option>
                    <option value="Concentric">Concentric</option>
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
                        className="w-3/4 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 dark:text-white text-center appearance-none"
                      />
                    </div>
                  ) : null
                )}
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className={`mt-6 w-3/4 mx-auto block py-2 rounded-lg transition text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Predicting..." : "Predict Performance"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
