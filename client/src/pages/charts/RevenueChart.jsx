// app/components/charts/RevenueChart.jsx
"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Tooltip tùy chỉnh cho giao diện Dark Mode
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatFullCurrency = (amount) => new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
      
    return (
      <div className="p-3 bg-gray-800/80 shadow-lg rounded-lg border border-white/10 backdrop-blur-sm">
        <p className="label font-bold text-white mb-2">{`Tháng ${label}`}</p>
        <p className="intro text-amber-400">
          {`Doanh thu: ${formatFullCurrency(payload[0].value)}`}
        </p>
        <p className="intro text-gray-400">
          {`Bookings: ${payload[0].payload.bookings.toLocaleString()}`}
        </p>
      </div>
    );
  }

  return null;
};

export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        barGap={8}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          stroke="#6B7280" // text-gray-500
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6B7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={false} // Ẩn các số liệu trục Y để giao diện sạch hơn
        />
        <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} content={<CustomTooltip />} />
        <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}