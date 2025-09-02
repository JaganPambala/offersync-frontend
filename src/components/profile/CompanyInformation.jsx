import React from "react";
import { Building2, Globe2, MapPin } from "lucide-react";

export const CompanyInformation = ({ company, isEditing, onChange }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Company Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Company</p>
            {isEditing ? (
              <input
                type="text"
                value={company.name}
                onChange={(e) => onChange("company.name", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{company.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Globe2 className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Industry</p>
            {isEditing ? (
              <input
                type="text"
                value={company.industry}
                onChange={(e) => onChange("company.industry", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{company.industry}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={company.location.city}
                  onChange={(e) =>
                    onChange("company.location.city", e.target.value)
                  }
                  placeholder="City"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={company.location.state}
                  onChange={(e) =>
                    onChange("company.location.state", e.target.value)
                  }
                  placeholder="State"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ) : (
              <p className="text-gray-900">
                {company.location.city}, {company.location.state}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
