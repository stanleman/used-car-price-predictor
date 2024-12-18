import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export default function Home() {
  return (
    <div className="">
      <div className="absolute inset-0 bg-black/40 -z-10"></div>
      <video
        src="supra.mp4"
        className="absolute top-0 -z-10 h-[100vh] w-full  object-cover flex justify-center items-center"
        autoPlay
        muted
        loop
      ></video>

      <div className="mx-auto px-3 justify-start text-neutral-200  text-container">
        <div className="h-[75vh] ml-2 md:ml-10 lg:ml-20 flex flex-col justify-end">
          <h1 className="font-serif font-bold text-[30px] md:text-[40px] lg:text-[60px]">
            Your car, your price
          </h1>

          <p className="text-sm md:text-lg font-normal !drop-shadow-md">
            Predicting prices for your used car.
          </p>
        </div>
      </div>

      <div className="w-full flex justify-end pr-6 mt-16">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-indigo-600 hover:bg-indigo-800"
            >
              <Info className="h-6 w-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] !bg-white/85">
            <DialogHeader>
              <DialogTitle>Problem Statement</DialogTitle>
              <DialogDescription>
                Understanding Used Car Price Prediction
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold">Challenge</h3>
              <p>
                Determining the accurate market value of a used car is complex
                and challenging. Multiple factors influence a vehicle's price,
                making traditional pricing methods often inaccurate or
                inconsistent.
              </p>

              <h3 className="text-lg font-semibold">Our Solution</h3>
              <p>
                We leverage machine learning algorithms to predict used car
                prices with high accuracy by analyzing various data points
                including:
              </p>
              <ul className="list-disc list-inside pl-4">
                <li>Manufacturer</li>
                <li>Year</li>
                <li>Mileage</li>
                <li>Dimensions</li>
              </ul>

              <p>
                The predictive model demonstrates high accuracy, with an
                R-squared value of 0.964 indicating that 96.4% of price variance
                is explained by the model. The Mean Squared Error of
                619,318,449.86 suggests an average prediction deviation of
                approximately RM 24,886.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
