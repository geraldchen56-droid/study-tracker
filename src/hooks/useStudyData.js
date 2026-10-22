import { useState, useEffect } from "react";

export function useStudyData(period) {
  const [sessions, setSessions] = useState([]);
  const [timeByDate, setTimeByDate] = useState([]);
  const [timeBySubject, setTimeBySubject] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        fetch(`/api/study-sessions?period=${period}`),
        fetch(`/api/study-stats?period=${period}`),
      ]);

      if (!sessionsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const sessionsData = await sessionsRes.json();
      const statsData = await statsRes.json();

      setSessions(sessionsData.sessions);
      setTimeByDate(statsData.timeByDate);
      setTimeBySubject(statsData.timeBySubject);
    } catch (err) {
      console.error(err);
      setError("Failed to load study data");
    }
  };

  return {
    sessions,
    timeByDate,
    timeBySubject,
    error,
    refetch: fetchData,
  };
}
