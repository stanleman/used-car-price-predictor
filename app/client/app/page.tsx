"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

interface PredictedPrice {
  price: number;
}

interface PredictionResponse {
  predicted_price: number;
}

export default function Home() {
  const [features, setFeatures] = useState<Record<string, number | string>>({});
  console.log(features);
  const [predictedPrice, setPredictedPrice] = useState<PredictedPrice | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    try {
      const processedFeatures = Object.values(features).map((value) => {
        if (typeof value === "number") return value;

        const num = Number(value);

        return !isNaN(num) ? num : 0;
      });

      const response = await axios.post<PredictionResponse>(
        "/api/predict",
        {
          features: processedFeatures,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      setPredictedPrice({
        price: response.data.predicted_price,
      });
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || "Server Error");
        } else if (error.request) {
          setError(
            "No response received from server. Check if server is running."
          );
        } else {
          setError("Error setting up the request");
        }
        console.error("Detailed Axios Error", error);
      } else {
        setError("An unexpected error occurred");
      }
      setPredictedPrice(null);
    }
  };

  const label_names = [
    "years",
    "manufacturers",
    "mileages",
    "colors",
    "transmissions",
    "doors",
    "seat_capacities",
    "assembled",
    "engine_ccs",
    "peak_powers",
    "peak_torques",
    "engine_types",
    "direct_injections",
    "aspirations",
    "fuel_types",
    "steering_types",
    "lengths",
    "widths",
    "heights",
    "wheel_bases",
    "kerb_weights",
    "fuel_tanks",
    "front_rims",
    "rear_rims",
  ];

  const encodedFeatures = {
    manufacturers: {
      0: "aston",
      1: "audi",
      2: "bentley",
      3: "bmw",
      4: "chevrolet",
      5: "citroen",
      6: "daihatsu",
      7: "ferrari",
      8: "ford",
      9: "honda",
      10: "hyundai",
      11: "infiniti",
      12: "isuzu",
      13: "jaguar",
      14: "jeep",
      15: "kia",
      16: "lamborghini",
      17: "land",
      18: "lexus",
      19: "maserati",
      20: "mazda",
      21: "mclaren",
      22: "mercedes",
      23: "mini",
      24: "mitsubishi",
      25: "nissan",
      26: "perodua",
      27: "peugeot",
      28: "porsche",
      29: "proton",
      30: "renault",
      31: "rolls",
      32: "subaru",
      33: "suzuki",
      34: "toyota",
      35: "volkswagen",
      36: "volvo",
    },
    colors: {
      0: "Beige",
      1: "Black",
      2: "Blue",
      3: "Bronze",
      4: "Brown",
      5: "Gold",
      6: "Green",
      7: "Grey",
      8: "Magenta",
      9: "Maroon",
      10: "Orange",
      11: "Pink",
      12: "Purple",
      13: "Red",
      14: "Silver",
      15: "White",
      16: "Yellow",
    },
    transmissions: {
      0: "automatic",
      1: "manual",
    },
    assembled: {
      0: "locally built",
      1: "official import",
      2: "parallel import",
    },
    engine_types: {
      0: "piston",
      1: "rotary",
    },
    direct_injections: {
      0: "direct injection",
      1: "direct/multi-point injection",
      2: "multi-point injected",
    },
    aspirations: {
      0: "aspirated",
      1: "supercharged",
      2: "supercharged intercooled",
      3: "turbo intercooled",
      4: "turbo supercharged intercooled",
      5: "turbocharged",
      6: "twin turbo intercooled",
      7: "twin-scroll turbo",
    },
    fuel_types: {
      0: "diesel",
      1: "hybrid",
      2: "petrol - unleaded (ulp)",
    },
    steering_types: {
      0: "electronic power steering",
      1: "hydraulic power",
      2: "rack and pinion",
      3: "recirculating ball",
      4: "worm and roller",
    },
  };

  const encodedFeatureColumns = [
    "manufacturers",
    "colors",
    "transmissions",
    "assembled",
    "engine_types",
    "direct_injections",
    "aspirations",
    "fuel_types",
    "steering_types",
  ];

  const renderFeatureInputs = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const featureName = label_names[i];

      const isEncodedFeature = encodedFeatureColumns.includes(featureName);

      if (isEncodedFeature) {
        const encodedOptions =
          encodedFeatures[featureName as keyof typeof encodedFeatures];

        return (
          <div key={i} className="mb-4">
            <label
              htmlFor={`feature-${i}`}
              className="block text-sm font-medium text-gray-700"
            >
              {featureName}
            </label>
            <select
              id={`feature-${i}`}
              value={
                features[`feature-${i}`] !== undefined
                  ? features[`feature-${i}`]
                  : ""
              }
              onChange={(e) => {
                const selectedKey = e.target.value;
                setFeatures((prev) => ({
                  ...prev,
                  [`feature-${i}`]:
                    selectedKey === ""
                      ? ""
                      : (Number(selectedKey) as keyof typeof encodedOptions),
                }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Choose an option</option>
              {Object.entries(encodedOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div key={i} className="mb-4">
          <label
            htmlFor={`feature-${i}`}
            className="block text-sm font-medium text-gray-700"
          >
            {featureName}
          </label>
          <input
            type="text"
            id={`feature-${i}`}
            value={features[`feature-${i}`] || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFeatures((prev) => ({
                ...prev,
                [`feature-${i}`]: value,
              }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto px-32 py-10">
      <h1 className="text-2xl font-bold mb-6">Car Price Predictor</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <div className="grid grid-cols-4 gap-4">{renderFeatureInputs()}</div>
          <button
            onClick={handlePredict}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Predict Price
          </button>
        </div>

        <div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              {error}
            </div>
          )}

          {predictedPrice && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <strong>Predicted Price:</strong>
              <span className="ml-2">RM {predictedPrice.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
