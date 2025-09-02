import React from "react";
import { Save, X, Edit, CheckCircle, XCircle, Award } from "lucide-react";
import { Loader2 } from "lucide-react";

export const ProfileHeader = ({
  profile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isUpdating,
  onInputChange,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div className="ml-6">
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
            )}
            <div className="flex items-center mt-1">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-gray-600">{profile.role}</span>
            </div>
            <div className="flex items-center mt-1">
              {profile.isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-500 mr-2" />
              )}
              <span className="text-gray-600">
                {profile.isVerified
                  ? "Verified Account"
                  : "Pending Verification"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={onSave}
                disabled={isUpdating}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 shadow-sm"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
              <button
                onClick={onCancel}
                disabled={isUpdating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-md text-blue-600 hover:bg-blue-50 shadow-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
