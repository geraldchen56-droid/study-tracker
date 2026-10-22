export const subjectColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
];

export function prepareChartData(timeByDate) {
  const chartData = timeByDate.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    hours: (item.total_time / 60).toFixed(1),
  }));

  return chartData.length > 0
    ? chartData
    : [
        { date: "Mon", hours: 0 },
        { date: "Tue", hours: 0 },
        { date: "Wed", hours: 0 },
        { date: "Thu", hours: 0 },
        { date: "Fri", hours: 0 },
        { date: "Sat", hours: 0 },
        { date: "Sun", hours: 0 },
      ];
}

export function prepareSubjectChartData(timeBySubject, totalTime) {
  const subjectChartData = timeBySubject.map((item, index) => ({
    subject: item.subject,
    percentage: ((item.total_time / totalTime) * 100).toFixed(1),
    color: subjectColors[index % subjectColors.length],
  }));

  return subjectChartData.length > 0
    ? subjectChartData
    : [{ subject: "No data yet", percentage: 0, color: "#E3E2E0" }];
}

export function calculateTotalTime(sessions) {
  const totalTime = sessions.reduce((sum, s) => sum + s.time_done, 0);
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;
  return { totalTime, totalHours, totalMinutes };
}
