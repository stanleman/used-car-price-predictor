"use client";

import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentPng } from "recharts-to-png";
import { saveAs } from "file-saver";

const AreaChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("all");

  const [getPng, { ref, isLoading }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, "AvgPriceVsEngineCC.png");
    }
  }, [getPng]);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/carlist_cleaned.csv");
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            let processedData = results.data
              .map((item) => ({
                engine_cc: parseInt(item.engine_ccs),
                price: parseFloat(item.prices),
              }))
              .filter((item) => !isNaN(item.price) && !isNaN(item.engine_cc));

            if (filter === "filter1") {
              processedData = processedData.filter(
                (item) => item.engine_cc <= 1999
              );
            } else if (filter === "filter2") {
              processedData = processedData.filter(
                (item) => item.engine_cc <= 2999
              );
            } else if (filter === "filter3") {
              processedData = processedData.filter(
                (item) => item.engine_cc <= 4999
              );
            }

            const data = Object.values(
              processedData.reduce((acc, item) => {
                const range = Math.floor(item.engine_cc / 1000) * 1000;
                if (!acc[range]) {
                  acc[range] = {
                    engine_cc_range: `${range}-${range + 999}`,
                    totalPrice: 0,
                    count: 0,
                  };
                }
                acc[range].totalPrice += item.price;
                acc[range].count += 1;
                return acc;
              }, {})
            ).map((group) => ({
              name: group.engine_cc_range,
              price: group.totalPrice / group.count,
            }));

            setChartData(data);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCSV();
  }, [filter]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, price } = payload[0].payload;
      return (
        <div
          style={{
            background: "#fff",
            opacity: "0.9",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Engine CC:</strong> {name}
          </p>
          <p>
            <strong>Avg Price:</strong> RM {price.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="80%">
      <div className="flex gap-2 items-center mb-1">
        <button
          onClick={() => setFilter("all")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "all" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("filter1")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "filter1" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          0 - 1999 CC
        </button>

        <button
          onClick={() => setFilter("filter2")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "filter2" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          0 - 2999 CC
        </button>

        <button
          onClick={() => setFilter("filter3")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "filter3" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          0 - 4999 CC
        </button>
      </div>

      <AreaChart
        data={chartData}
        margin={{
          right: 30,
        }}
        ref={ref}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#8884d8" />
      </AreaChart>
      <div className="w-full flex justify-end">
        <button
          className="font-medium text-sm px-3 py-1  mb-5 bg-gray-600 hover:bg-gray-700 text-gray-400"
          onClick={handleDownload}
        >
          {isLoading ? "Downloading..." : "Export Chart"}
        </button>
      </div>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
