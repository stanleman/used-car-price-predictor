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
                      totalPrice: 0,
                      count: 0,
                    };
                  }
                  acc[item.manufacturer].totalPrice += item.price;
                  acc[item.manufacturer].count += 1;
                  return acc;
                }, {})
            )
              .map((group) => ({
                name: group.manufacturer.toString(),
                price: group.totalPrice / group.count,
              }))
              .sort((a, b) => a.price - b.price);

            setChartData(processedData);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchCSV();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      console.log(payload[0].payload);
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
            <strong>Manufacturer:</strong> {name}
          </p>
          <p>
            <strong>Avg Price:</strong>RM {price.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

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
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          type="monotone"
          dataKey="price"
          stackId="a"
          stroke="#3b82f6"
          fill="#8884d8"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
