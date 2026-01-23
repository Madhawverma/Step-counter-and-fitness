import StepCard from "../components/StepCard";
import ProgressBar from "../components/ProgressBar";
import WeeklyStats from "../components/WeeklyStats";

export default function Dashboard() {
  const steps = 6500;
  const goal = 10000;
  const calories = 220;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StepCard title="Steps Today" value={steps} />
        <StepCard title="Calories Burned" value={calories} />
      </div>
      <div className="bg-white mt-6 p-4 rounded-xl shadow">
        <p className="mb-2 font-semibold">
          Goal Progress: {steps}/{goal}
        </p>
        <ProgressBar percent={(steps / goal) * 100} />
      </div>
      <WeeklyStats />
    </div>
  );
}