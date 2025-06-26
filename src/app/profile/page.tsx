"use client";
import { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
  UpdateUserData,
} from "../utils/apis/user";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import Navigation from "../components/Navigation";

export default function ProfilePage() {
  const { token, user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData & { currentPassword?: string }>({
    email: "",
    fullName: "",
    password: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (token) {
      loadUserProfile();
    }
  }, [token]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Loading user profile...");
      const userData = await getUserProfile();
      console.log("User data received:", userData);
      setUser(userData);
      setFormData({
        email: userData.email,
        fullName: userData.fullName,
        password: "",
        currentPassword: "",
      });
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangePassword(e.target.checked);
    if (!e.target.checked) {
      setFormData((prev) => ({ ...prev, password: "", currentPassword: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: UpdateUserData & { currentPassword?: string } = {};
    if (formData.email !== user?.email) updatedData.email = formData.email;
    if (formData.fullName !== user?.fullName) updatedData.fullName = formData.fullName;
    if (changePassword) {
      if (!formData.password || !formData.currentPassword) {
        setError("Please provide both current and new password.");
        return;
      }
      updatedData.password = formData.password;
      updatedData.currentPassword = formData.currentPassword;
    }
    if (Object.keys(updatedData).length === 0) {
      setError("No changes detected");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      console.log("Updating profile with:", updatedData);
      const updatedUser = await updateUserProfile(updatedData);
      console.log("Profile updated successfully:", updatedUser);

      setUser(updatedUser);
      setFormData((prev) => ({
        ...prev,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        password: "",
        currentPassword: "",
      }));

      // Update the user data in AuthProvider to keep it consistent
      updateUser({
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      });

      // setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        email: user.email,
        fullName: user.fullName,
        password: "",
        currentPassword: "",
      });
    }
    // setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 ">
        {/* Navigation Bar */}
        <Navigation isAuthenticated={true} />

        <div className="pt-36 pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Edit Profile
                  </h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your profile...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoading && !user && (
                <div className="px-6 py-8 text-center">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Unable to load profile data</p>
                    {error && <p className="text-sm mt-1">{error}</p>}
                  </div>
                  <button
                    onClick={loadUserProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Profile Content */}
              {!isLoading && user && (
                <>
                  {/* Alert Messages */}
                  {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800">{success}</p>
                    </div>
                  )}

                  {/* Profile Form */}
                  <div className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled
                          className={`w-full px-3 text-gray-500 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          required
                        />
                      </div>

                      {/* Change Password Checkbox */}
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id="changePassword"
                          checked={changePassword}
                          onChange={handleCheckboxChange}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <label htmlFor="changePassword" className="text-sm text-gray-700">Change Password?</label>
                      </div>

                      {/* Current Password */}
                      {changePassword && (
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required={changePassword}
                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"}`}
                          />
                        </div>
                      )}

                      {/* New Password */}
                      {changePassword && (
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required={changePassword}
                            placeholder={isEditing ? "Leave blank to keep current password" : ""}
                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"}`}
                          />
                        </div>
                      )}

                      {/* Role (Read-only) */}
                      {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    value={user?.role || ''}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                                                />
                                            </div> */}

                      {/* Action Buttons */}
                      {isEditing && (
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
