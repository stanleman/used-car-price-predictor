"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PredictedPrice {
  price: number;
}

interface PredictionResponse {
  predicted_price: number;
}

export default function Home() {
  const [features, setFeatures] = useState<Record<any, any>>(
    Array.from({ length: 24 }, (_, index) => `feature-${index}`).reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as Record<string, string>
    )
  );

  console.log(Object.keys(features).length);
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

  const preencoded_label_names = [
    "Year",
    "Manufacturer",
    "Mileage",
    "Color",
    "Transmission",
    "Door",
    "Seat capacity",
    "Assembled",
    "Engine CC",
    "Peak Power (hp)",
    "Peak Torque (nm)",
    "Engine Type",
    "Direct Injection",
    "Aspiration",
    "Fuel Type",
    "Steering Type",
    "Length (mm)",
    "Width (mm)",
    "Height (mm)",
    "Wheel Base (mm)",
    "Kerb Weight (kg)",
    "Fuel Tank (litres)",
    "Front Rim (inches)",
    "Rear Rim (inches)",
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
      const preEncodedFeatureName = preencoded_label_names[i];

      const isEncodedFeature = encodedFeatureColumns.includes(featureName);

      if (isEncodedFeature) {
        const encodedOptions =
          encodedFeatures[featureName as keyof typeof encodedFeatures];

        return (
          <div key={i} className="mb-4">
            <label
              htmlFor={`feature-${i}`}
              className="block text-sm font-medium text-neutral-400"
            >
              {preEncodedFeatureName}
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
              className="mt-1 rounded-lg w-full p-2.5 bg-slate-900/50 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
            className="block text-sm font-medium text-neutral-400"
          >
            {preEncodedFeatureName}
          </label>
          <input
            required
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
            className="mt-1 rounded-lg w-full p-2.5 bg-slate-900/50 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    });
  };

  const checkFeaturesEmpty = () => {
    const anyEmpty = Object.values(features).some((value) => value === "");

    if (anyEmpty) {
      return true;
    }

    return false;
  };

  const exampleOne = () => {
    setFeatures({
      "feature-0": "2021",
      "feature-1": 3,
      "feature-2": "50000",
      "feature-3": 7,
      "feature-4": 0,
      "feature-5": "5",
      "feature-6": "5",
      "feature-7": 0,
      "feature-8": "1988",
      "feature-9": "184",
      "feature-10": "300",
      "feature-11": 0,
      "feature-12": 0,
      "feature-13": 7,
      "feature-14": 2,
      "feature-15": 2,
      "feature-16": "4936",
      "feature-17": "1868",
      "feature-18": "1483",
      "feature-19": "2975",
      "feature-20": "1845",
      "feature-21": "46",
      "feature-22": "19",
      "feature-23": "19",
    });
  };

  const exampleTwo = () => {
    setFeatures({
      "feature-0": "2020",
      "feature-1": 9,
      "feature-2": "85000",
      "feature-3": 15,
      "feature-4": 0,
      "feature-5": "5",
      "feature-6": "5",
      "feature-7": 0,
      "feature-8": "1497",
      "feature-9": "120",
      "feature-10": "145",
      "feature-11": 0,
      "feature-12": 2,
      "feature-13": 0,
      "feature-14": 2,
      "feature-15": 2,
      "feature-16": "3989",
      "feature-17": "1694",
      "feature-18": "1668",
      "feature-19": "2530",
      "feature-20": "1099",
      "feature-21": "40",
      "feature-22": "16",
      "feature-23": "16",
    });
  };

  const resetFeatures = () => {
    setFeatures(
      Array.from({ length: 24 }, (_, index) => `feature-${index}`).reduce(
        (acc, key) => {
          acc[key] = "";
          return acc;
        },
        {} as Record<string, string>
      )
    );

    setPredictedPrice(null);
  };

  return (
    <div className="container mx-auto px-10 lg:px-24  py-1">
      <div className="flex gap-2 justify-start items-center mb-6">
        <h1 className="text-2xl font-bold text-white mr-5">
          Car Price Predictor
        </h1>

        <button
          onClick={exampleOne}
          className="py-2 px-4 flex items-center rounded transition border border-neutral-400 text-neutral-400 hover:text-white hover:border-white bg-transparent hover:bg-slate-500/5"
        >
          <img src="bmw.png" className="h-5 w-5 mr-2" />
          2021 BMW 530e
        </button>

        <button
          onClick={exampleTwo}
          className="py-2 px-4 flex items-center rounded transition border border-neutral-400 text-neutral-400 hover:text-white hover:border-white bg-transparent hover:bg-slate-500/5"
        >
          <img src="honda.png" className="h-5 w-5 mr-2" />
          2020 Honda Jazz
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {renderFeatureInputs()}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={checkFeaturesEmpty()}
              onClick={handlePredict}
              className={`mt-4 w-full py-2 rounded transition font-bold ${
                checkFeaturesEmpty()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-900"
              }`}
            >
              Predict Price
            </button>
            <button
              onClick={resetFeatures}
              className="mt-4 font-bold w-full py-2 rounded transition bg-red-600 text-white hover:bg-red-900"
            >
              Reset features
            </button>
          </div>
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
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
              <strong>Predicted Price:</strong>
              <span className="ml-2">
                RM{" "}
                {(
                  Math.round(predictedPrice.price * 100) / 100
                ).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
