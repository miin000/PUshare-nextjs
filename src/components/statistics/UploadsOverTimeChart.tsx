// src/components/statistics/UploadsOverTimeChart.tsx
'use client';
import { useUploadsOverTime } from '@/hooks/useUploadsOverTime';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UploadsOverTimeChart() {
  const { data, isLoading } = useUploadsOverTime();

  if (isLoading) return <p>Đang tải biểu đồ...</p>;

  // Định dạng lại ngày tháng cho ngắn gọn (ví dụ: 'Oct 01')
  const formattedData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    // ResponsiveContainer sẽ làm biểu đồ co giãn theo component cha
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}