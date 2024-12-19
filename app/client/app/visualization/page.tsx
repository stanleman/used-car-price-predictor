import React from "react";
import LineChart from "../components/LineChart.js";
import AreaChart from "../components/AreaChart.js";
import BarChart from "../components/BarChart.js";
import RadialChart from "../components/RadialChart.js";
import PieChart from "../components/PieChart.js";

export default function Visualization() {
  return (
    <main className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-10 ">
      <div className="grid grid-cols-1 w-full gap-10 max-w-[1400px]">
        <div className="flex flex-col items-center justify-center p-4 !pt-0 pb-12 border border-slate-900 bg-slate-900/50 rounded-xl h-[500px]">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Average Price vs Year
          </h3>
          <LineChart />
        </div>

        <div className="flex flex-col items-center justify-center p-4 !pt-0 pb-12 border border-slate-900 bg-slate-900/50 rounded-xl h-[500px]">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Average Price vs Year
          </h3>
          <AreaChart />
        </div>

        <GridItem title="Average Price vs Manufacturer">
          <BarChart />
        </GridItem>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <GridItem title="Total Price Distribution of Colors">
            <RadialChart />
          </GridItem>

          <GridItem title="Fuel Type Distribution">
            <PieChart />
          </GridItem>
        </div>
      </div>
    </main>
  );
}

function GridItem({ title, children }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[500px]">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
