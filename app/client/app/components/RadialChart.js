"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RadialChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/carlist_cleaned.csv");
        const csv = await response.text();

        const colorMapping = {
          Bronze: "#8B4513",
        };

        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const processedData = Object.values(
              results.data
                .map((item) => ({
                  color: item.colors,
                  price: parseFloat(item.prices),
                }))
                .filter((item) => !isNaN(item.price) && item.color)
                .reduce((acc, item) => {
                  if (!acc[item.color]) {
                    acc[item.color] = {
                      color: item.color,
                      totalPrice: 0,
                      count: 0,
                    };
                  }
                  acc[item.color].totalPrice += item.price;
                  acc[item.color].count += 1;
                  return acc;
                }, {})
            )
              .map((group) => ({
                name: group.color,
                totalPrice: group.totalPrice,
                averagePrice: group.totalPrice / group.count,
                count: group.count,
                fill: colorMapping[group.color] || group.color,
              }))
              .sort((a, b) => a.totalPrice - b.totalPrice);

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
    transform: "translate(-130%, -50%)",
    lineHeight: "24px",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, totalPrice } = payload[0].payload;
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
            <strong>Color:</strong> {name}
          </p>
          <p>
            <strong>Total Price:</strong> RM {totalPrice.toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="5%"
          outerRadius="90%"
          barSize={20}
          data={chartData}
        >
          <RadialBar
            minAngle={15}
            background={{ fill: "#dddddd" }}
            clockWise
            dataKey="totalPrice"
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={style}
          /> */}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadialChartComponent;
