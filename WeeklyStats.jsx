export default function WeeklyStats() {
  const data = [
    { day: "Mon", steps: 6000 },
    { day: "Tue", steps: 7000 },
    { day: "Wed", steps: 8000 }
  ];

  return (
    <div className="bg-white mt-6 p-4 rounded-xl shadow">
      <h3 className="font-bold mb-2">Weekly Summary</h3>
      {data.map((d, i) => (
        <p key={i}>{d.day}: {d.steps} steps</p>
      ))}
    </div>
  );
}