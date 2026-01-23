export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <input className="input" placeholder="Name" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" />
        <input className="input" placeholder="Height (cm)" />
        <input className="input" placeholder="Weight (kg)" />
        <input className="input" placeholder="Daily Step Goal" />
        <button className="w-full bg-green-500 text-white p-2 rounded">
          Create Account
        </button>
      </div>
    </div>
  );
}