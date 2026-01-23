import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button className="w-full bg-green-500 text-white p-2 rounded">
          Login
        </button>
        <p className="text-sm text-center mt-3">
          New user? <Link to="/register" className="text-green-600">Register</Link>
        </p>
      </div>
    </div>
  );
}