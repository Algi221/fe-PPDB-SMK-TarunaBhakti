"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DashboardAreaChartProps {
  data: number[];
  labels: string[];
  color?: string;
}

export default function DashboardAreaChart({
  data,
  labels,
  color = "#3b82f6",
}: DashboardAreaChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const series = [
    {
      name: "Pendaftar",
      data: data,
    },
  ];

  const options: any = {
    legend: { show: false },
    colors: [color],
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      sparkline: {
        show: true,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.15,
        stops: [0, 90, 100]
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    grid: {
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: isDark ? "#334155" : "#e2e8f0",
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
  };

  return (
    <div className="w-full h-75">
      <div className="-ml-3">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={320}
          width={"100%"}
        />
      </div>
    </div>
  );
}
