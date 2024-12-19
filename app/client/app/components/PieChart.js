"use client";

import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useCurrentPng } from "recharts-to-png";
import { saveAs } from "file-saver";

const PieChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  const [getPng, { ref, isLoading }] = useCurrentPng();
  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, "FuelTypeDist.png");
    }
  }, [getPng]);

  const colorMapping = {
    "petrol - unleaded (ulp)": "#8884D8",
    hybrid: "#7D39E8",
    diesel: "#2C306A",
  };

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/carlist_cleaned.csv");
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const processedData = Object.values(
              results.data
                .map((item) => ({
                  fuel_type: item.fuel_types,
                }))
                .reduce((acc, item) => {
                  if (!acc[item.fuel_type]) {
                    acc[item.fuel_type] = {
                      name: item.fuel_type,
                      count: 0,
                    };
                  }
                  acc[item.fuel_type].count += 1;
                  return acc;
                }, {})
            ).map((group) => ({
              name: group.name,
              count: group.count,
              fill: colorMapping[group.name],
            }));

            setChartData(processedData);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCSV();
  }, []);

  const style = {
    top: "50%",
    right: 0,
    transform: "translate(-100%, -50%)",
    lineHeight: "24px",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, count } = payload[0].payload;
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
            <strong>Fuel Type:</strong> {name}
          </p>
          <p>
            <strong>Count:</strong> {count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[85%]">
      <ResponsiveContainer>
        <PieChart ref={ref}>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="100%"
          />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="w-full flex justify-end">
        <button
          className="font-medium text-sm px-3 py-1  mb-5 bg-gray-600 hover:bg-gray-700 text-gray-400 hover:text-gray-300"
          onClick={handleDownload}
        >
          {isLoading ? "Downloading..." : "Export Chart"}
        </button>
      </div>
    </div>
  );
};

export default PieChartComponent;
