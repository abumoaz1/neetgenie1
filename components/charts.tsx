"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Fallback data for charts when real data isn't available
const fallbackSubjectData = [
  { subject: "Physics", score: 0 },
  { subject: "Chemistry", score: 0 },
  { subject: "Biology", score: 0 }
];

const fallbackTrendData = [
  { date: "Week 1", physics: 0, chemistry: 0, biology: 0 }
];

export const SubjectBarChart = ({ data }: { data: any[] }) => {
  const chartData = (!data || !Array.isArray(data) || data.length === 0) 
    ? fallbackSubjectData 
    : data;
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="score" 
            fill="#4a90e2" 
            name="Average Score (%)"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendLineChart = ({ data }: { data: any[] }) => {
  const chartData = (!data || !Array.isArray(data) || data.length === 0) 
    ? fallbackTrendData 
    : data;
  
  // Get subject keys for line chart
  const firstItem = chartData[0] || {};
  const trendSubjects = Object.keys(firstItem).filter(key => key !== 'date');
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {trendSubjects.map(subject => {
            const colors: Record<string, string> = {
              physics: "#2563eb",
              chemistry: "#10b981",
              biology: "#f59e0b"
            };
            return (
              <Line 
                key={subject}
                type="monotone" 
                dataKey={subject} 
                stroke={colors[subject] || "#8884d8"} 
                name={subject.charAt(0).toUpperCase() + subject.slice(1)} 
                strokeWidth={2} 
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};