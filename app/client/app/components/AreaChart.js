"use client";

import { useState, useEffect } from "react";
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

const AreaChartComponent = () => {
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
                  engine_cc: parseInt(item.engine_ccs),
                  price: parseFloat(item.prices),
                }))
                .filter((item) => !isNaN(item.price) && !isNaN(item.engine_cc))
                .reduce((acc, item) => {
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
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
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
        <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
