import React from "react";
import LineChart from "../components/LineChart.js";
import AreaChart from "../components/AreaChart.js";
import BarChart from "../components/BarChart.js";
import RadialChart from "../components/RadialChart.js";

export default function Visualization() {
  return (
    <main className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-10 ">
      <div className="grid grid-cols-1 w-full gap-10 max-w-[1400px]">
        <GridItem title="Average Price vs Year">
          <LineChart />
        </GridItem>

        <GridItem title="Average Price vs Engine CC">
          <AreaChart />
        </GridItem>

        <GridItem title="Manufacturer Count">
          <BarChart />
        </GridItem>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <GridItem title="Honda Car Colors">
            <RadialChart />
          </GridItem>
        </div>
      </div>
    </main>
  );
}

function GridItem({ title, children }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[400px]">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
