export default function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}