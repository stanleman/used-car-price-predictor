"use client";

import { useState, useEffect } from "react";
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

const LineChartComponent = () => {
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
                  year: parseInt(item.years),
                  price: parseFloat(item.prices),
                }))
                .filter((item) => !isNaN(item.price) && !isNaN(item.year))
                .reduce((acc, item) => {
                  if (!acc[item.year]) {
                    acc[item.year] = {
                      year: item.year,
                      totalPrice: 0,
                      count: 0,
                    };
                  }
                  acc[item.year].totalPrice += item.price;
                  acc[item.year].count += 1;
                  return acc;
                }, {})
            ).map((group) => ({
              name: group.year.toString(),
              price: group.totalPrice / group.count,
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line type="monotone" dataKey="price" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
