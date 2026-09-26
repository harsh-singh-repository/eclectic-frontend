"use client";

import { ChevronDown } from "lucide-react";
import { performanceTrend } from "./analyticsData";

const WIDTH = 640;
const HEIGHT = 260;
const PAD_LEFT = 36;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const MAX_Y = 100;
const Y_TICKS = [0, 20, 40, 60, 80, 100];

function toPoint(index, value, count) {
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const x = PAD_LEFT + (index / (count - 1)) * innerW;
  const y = PAD_TOP + innerH - (value / MAX_Y) * innerH;
  return [x, y];
}

export function PerformanceTrendChart() {
  const points = performanceTrend.map((d, i) => toPoint(i, d.value, performanceTrend.length));
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const [firstX] = points[0];
  const [lastX] = points[points.length - 1];
  const baseY = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM);
  const areaPath = `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Performance Trend
        </h2>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-teal-200 transition-colors duration-150 cursor-pointer"
        >
          Last 8 Weeks
          <ChevronDown size={13} />
        </button>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines + y labels */}
        {Y_TICKS.map((tick) => {
          const y = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * (1 - tick / MAX_Y);
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth={1}
              />
              <text x={0} y={y + 4} fontSize="10" fill="#9CA3AF">
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area + line */}
        <path d={areaPath} fill="url(#trendFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="#14b8a6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill="#14b8a6" stroke="#fff" strokeWidth={2} />
        ))}

        {/* X labels */}
        {performanceTrend.map((d, i) => {
          const [x] = points[i];
          return (
            <text
              key={d.label}
              x={x}
              y={HEIGHT - 6}
              fontSize="10"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}