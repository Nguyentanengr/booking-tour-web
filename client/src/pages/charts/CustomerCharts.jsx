// app/components/charts/CustomerCharts.jsx
"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Định nghĩa màu sắc cho biểu đồ tròn
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// --- Biểu đồ Tăng trưởng người dùng (Area Chart) ---
export function UserGrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="users"
          name="Tổng người dùng"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUsers)"
        />
        <Area
          type="monotone"
          dataKey="newUsers"
          name="Người dùng mới"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorNewUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- Biểu đồ Nguồn truy cập (Donut Chart) ---
export function TrafficSourceDonutChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="source"
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                        background: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}