"use client";

import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentPng } from "recharts-to-png";
import { saveAs } from "file-saver";

const LineChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("all");

  const [getPng, { ref, isLoading }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, "AvgPriceVsYear.png");
    }
  }, [getPng]);

  const currentYear = new Date().getFullYear();

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
                year: parseInt(item.years),
                price: parseFloat(item.prices),
              }))
              .filter((item) => !isNaN(item.price) && !isNaN(item.year));

            if (filter === "fiveYears") {
              processedData = processedData.filter(
                (item) => currentYear - item.year <= 5
              );
            } else if (filter === "tenYears") {
              processedData = processedData.filter(
                (item) => currentYear - item.year <= 10
              );
            } else if (filter === "twentyYears") {
              processedData = processedData.filter(
                (item) => currentYear - item.year <= 20
              );
            }

            const data = Object.values(
              processedData.reduce((acc, item) => {
                const yearsElapsed = currentYear - item.year;
                if (!acc[yearsElapsed]) {
                  acc[yearsElapsed] = {
                    yearsElapsed: yearsElapsed,
                    year: item.year,
                    totalPrice: 0,
                    count: 0,
                  };
                }
                acc[yearsElapsed].totalPrice += item.price;
                acc[yearsElapsed].count += 1;
                return acc;
              }, {})
            )
              .map((group) => ({
                name: `${group.yearsElapsed}y`,
                year: group.year,
                price: group.totalPrice / group.count,
              }))
              .sort((a, b) => b.year - a.year);

            setChartData(data);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCSV();
  }, [filter, currentYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { year, price } = payload[0].payload;
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
            <strong>Year:</strong> {year}
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
          onClick={() => setFilter("fiveYears")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "fiveYears" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          5 years
        </button>

        <button
          onClick={() => setFilter("tenYears")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "tenYears" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          10 years
        </button>

        <button
          onClick={() => setFilter("twentyYears")}
          className={`font-medium rounded-lg text-sm px-5 py-2.5  mb-2 bg-blue-600/20 hover:bg-blue-700/20 text-gray-900 ${
            filter == "twentyYears" ? "!bg-blue-600 hover:!bg-blue-700" : ""
          }`}
        >
          20 years
        </button>
      </div>

      <LineChart
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
        <Line type="monotone" dataKey="price" stroke="#3b82f6" />
      </LineChart>
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

export default LineChartComponent;
