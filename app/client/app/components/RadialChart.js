"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RadialChartComponent = () => {
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
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="80%"
        barSize={10}
        data={chartData}
      >
        <RadialBar
          minAngle={15}
          label={{ position: "insideStart", fill: "#fff" }}
          background
          clockWise
          dataKey="name"
        />
        {/* <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            top: "50%",
            right: 0,
            transform: "translate(0, -50%)",
            lineHeight: "24px",
          }}
        /> */}
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// change return

export default RadialChartComponent;
