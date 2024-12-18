"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = () => {
  const [chartData, setChartData] = useState([]);

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
                  manufacturer: item.manufacturers,
                  price: parseFloat(item.prices),
                }))
                .filter((item) => !isNaN(item.price) && item.manufacturer)
                .reduce((acc, item) => {
                  if (!acc[item.manufacturer]) {
                    acc[item.manufacturer] = {
                      manufacturer: item.manufacturer,
                      count: 0,
                    };
                  }
                  acc[item.manufacturer].count += 1;
                  return acc;
                }, {})
            )
              .map((group) => ({
                name: group.manufacturer.toString(),
                count: group.count,
              }))
              .sort((a, b) => b.count - a.count);

            setChartData(processedData);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCSV();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          type="monotone"
          dataKey="count"
          stackId="a"
          stroke="#3b82f6"
          fill="#8884d8"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
