import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
  Globe2,
  Users,
  Bell,
  Settings,
  Edit,
  CheckCircle,
  XCircle,
  Award,
  MessageSquare,
  UserCheck,
  BarChart3,
  Loader2,
  Save,
  X,
  Shield,
} from "lucide-react";
import { navigationLinks } from "../utils/constants";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../redux/api/profileApiSlice";
import {
  startEditing,
  cancelEditing,
  updateEditedProfile,
  selectEditMode,
  selectEditedProfile,
} from "../redux/slices/profileSlice";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { CompanyInformation } from "../components/profile/CompanyInformation";

export default function MyProfile() {
  const dispatch = useDispatch();
  const editMode = useSelector(selectEditMode);
  const editedProfile = useSelector(selectEditedProfile);

  const { data: profileData, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profile = profileData?.data;

  const handleEdit = () => {
    // Create a structured edit object that matches the API payload structure
    const editableProfile = {
      name: profile.name,
      company: {
        name: profile.company.name,
        industry: profile.company.industry,
        size: profile.company.size,
        location: {
          city: profile.company.location.city,
          state: profile.company.location.state,
          country: profile.company.location.country,
        },
      },
      whatsapp: {
        phoneNumber: profile.whatsapp.phoneNumber,
        isBusinessAccount: profile.whatsapp.isBusinessAccount,
        autoReplyMessage: profile.whatsapp.autoReplyMessage,
        preferredHours: {
          start: profile.whatsapp.preferredHours.start,
          end: profile.whatsapp.preferredHours.end,
          timezone: profile.whatsapp.preferredHours.timezone,
        },
      },
      preferences: {
        theme: profile.preferences.theme,
        emailNotifications: profile.preferences.emailNotifications,
        whatsappNotifications: profile.preferences.whatsappNotifications,
        weeklyReports: profile.preferences.weeklyReports,
      },
    };
    dispatch(startEditing(editableProfile));
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
  };

  const handleSave = async () => {
    try {
      if (editedProfile) {
        // Prepare the update payload according to API structure
        const updatePayload = {
          name: editedProfile.name,
          company: {
            name: editedProfile.company.name,
            industry: editedProfile.company.industry,
            size: editedProfile.company.size,
            location: {
              city: editedProfile.company.location.city,
              state: editedProfile.company.location.state,
              country: editedProfile.company.location.country,
            },
          },
          whatsapp: {
            phoneNumber: editedProfile.whatsapp.phoneNumber,
            isBusinessAccount: editedProfile.whatsapp.isBusinessAccount,
            autoReplyMessage: editedProfile.whatsapp.autoReplyMessage,
            preferredHours: {
              start: editedProfile.whatsapp.preferredHours.start,
              end: editedProfile.whatsapp.preferredHours.end,
              timezone: editedProfile.whatsapp.preferredHours.timezone,
            },
          },
          preferences: {
            theme: editedProfile.preferences.theme,
            emailNotifications: editedProfile.preferences.emailNotifications,
            whatsappNotifications:
              editedProfile.preferences.whatsappNotifications,
            weeklyReports: editedProfile.preferences.weeklyReports,
          },
        };

        await updateProfile(updatePayload).unwrap();
        dispatch(cancelEditing());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field, value) => {
    const updateData = {};

    // Handle nested object updates
    if (field.includes(".")) {
      const [parent, child, grandchild] = field.split(".");
      if (grandchild) {
        updateData[parent] = {
          ...(editedProfile[parent] || {}),
          [child]: {
            ...(editedProfile[parent]?.[child] || {}),
            [grandchild]: value,
          },
        };
      } else {
        updateData[parent] = {
          ...(editedProfile[parent] || {}),
          [child]: value,
        };
      }
    } else {
      updateData[field] = value;
    }

    dispatch(updateEditedProfile(updateData));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p>No profile data available</p>
      </div>
    );
  }

  const displayProfile = editMode ? editedProfile : profile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        profile={displayProfile}
        isEditing={editMode}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        isUpdating={isUpdating}
        onInputChange={handleInputChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyInformation
          company={displayProfile.company}
          isEditing={editMode}
          onChange={handleInputChange}
        />

        {/* WhatsApp Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            WhatsApp Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                {editMode ? (
                  <input
                    type="text"
                    value={displayProfile.whatsapp.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("whatsapp.phoneNumber", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {displayProfile.whatsapp.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Preferred Hours
                </p>
                {editMode ? (
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <label className="block text-xs text-gray-500">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={displayProfile.whatsapp.preferredHours.start}
                        onChange={(e) =>
                          handleInputChange(
                            "whatsapp.preferredHours.start",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={displayProfile.whatsapp.preferredHours.end}
                        onChange={(e) =>
                          handleInputChange(
                            "whatsapp.preferredHours.end",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {displayProfile.whatsapp.preferredHours.start} -{" "}
                    {displayProfile.whatsapp.preferredHours.end}
                    <span className="text-gray-500 text-sm ml-2">
                      ({displayProfile.whatsapp.preferredHours.timezone})
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Auto Reply Message
                </p>
                {editMode ? (
                  <textarea
                    value={displayProfile.whatsapp.autoReplyMessage}
                    onChange={(e) =>
                      handleInputChange(
                        "whatsapp.autoReplyMessage",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {displayProfile.whatsapp.autoReplyMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">Business Account</span>
              </div>
              <input
                type="checkbox"
                checked={displayProfile.whatsapp.isBusinessAccount}
                onChange={(e) =>
                  handleInputChange(
                    "whatsapp.isBusinessAccount",
                    e.target.checked
                  )
                }
                disabled={!editMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">Email Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={displayProfile.preferences.emailNotifications}
                onChange={(e) =>
                  handleInputChange(
                    "preferences.emailNotifications",
                    e.target.checked
                  )
                }
                disabled={!editMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">WhatsApp Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={displayProfile.preferences.whatsappNotifications}
                onChange={(e) =>
                  handleInputChange(
                    "preferences.whatsappNotifications",
                    e.target.checked
                  )
                }
                disabled={!editMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">Weekly Reports</span>
              </div>
              <input
                type="checkbox"
                checked={displayProfile.preferences.weeklyReports}
                onChange={(e) =>
                  handleInputChange(
                    "preferences.weeklyReports",
                    e.target.checked
                  )
                }
                disabled={!editMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">Theme</span>
              </div>
              {editMode ? (
                <select
                  value={displayProfile.preferences.theme}
                  onChange={(e) =>
                    handleInputChange("preferences.theme", e.target.value)
                  }
                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              ) : (
                <span className="text-gray-700 capitalize">
                  {displayProfile.preferences.theme}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Permissions</h2>
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(profile.permissions).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <CheckCircle
                  className={`h-5 w-5 ${
                    value ? "text-green-500" : "text-red-500"
                  } mr-3`}
                />
                <span className="text-gray-900">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
