import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function StudyCharts({ chartData, subjectChartData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-6">
        <h3 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-4">
          Study Time Over Period
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E2E0" />
            <XAxis dataKey="date" tick={{ fill: "#787774", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#787774", fontSize: 12 }}
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                fill: "#787774",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E3E2E0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#37352F", fontWeight: 600 }}
            />
            <Bar dataKey="hours" fill="#2383E2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E3E2E0] dark:border-[#2C2C2C] p-6">
        <h3 className="text-lg font-semibold text-[#37352F] dark:text-[#DEDEDE] mb-4">
          Study Time by Subject (%)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E2E0" />
            <XAxis dataKey="subject" tick={{ fill: "#787774", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#787774", fontSize: 12 }}
              label={{
                value: "Percentage",
                angle: -90,
                position: "insideLeft",
                fill: "#787774",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E3E2E0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#37352F", fontWeight: 600 }}
            />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
              {subjectChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
