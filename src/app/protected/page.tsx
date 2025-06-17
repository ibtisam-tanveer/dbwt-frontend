"use client";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedPage() {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
        <div className="mb-4">Welcome, <span className="font-semibold">{user?.fullName}</span> ({user?.email})</div>
        <div className="mb-4">Role: <span className="font-semibold">{user?.role}</span></div>
        <button onClick={logout} className="bg-red-600 text-white p-2 rounded">Logout</button>
      </div>
    </ProtectedRoute>
  );
} 