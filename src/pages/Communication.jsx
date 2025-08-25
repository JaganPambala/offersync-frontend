import React, { useState } from "react";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  User,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";

import {
  useGetCommunicationsQuery,
  useUpdateCommunicationOutcomeMutation,
} from "../redux/api/communicationApiSlice";
import UpdateOutcomeModal from "../components/common/UpdateOutcomeModal";

const Communications = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);   
  console.log("communi---------", selectedCommunication);    

  const {
    data: apiResponse = {},
    isLoading,
    error,
  } = useGetCommunicationsQuery();

  const communications = apiResponse.success ? apiResponse.data : [];

  const filteredCommunications = communications.filter((comm) => {
    const matchesStatus =
      statusFilter === "ALL" || comm.status === statusFilter;
    const matchesRole = roleFilter === "ALL" || comm.role === roleFilter;
    return matchesStatus && matchesRole;
  });

  // Display label mapping
  const getDisplayStatus = (status) => {
    if (status === "INITIATED") return "ACTIVE";
    return status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "INITIATED":
        return "bg-yellow-100 text-yellow-800"; // Displayed as ACTIVE
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "INITIATED":
        return <Clock className="h-4 w-4" />; // Displayed as ACTIVE
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) =>
    role === "INITIATOR"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const generateWhatsAppLink = (communication) => {
    const message = `Hi ${communication.otherParty.name}! Following up on our discussion about ${communication.candidate.name}.`;
    return `https://wa.me/${communication.otherParty.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const summaryStats = {
    total: communications.length,
    active: communications.filter((c) => c.status === "INITIATED").length,
    resolved: communications.filter((c) => c.status === "RESOLVED").length,
    averageResponseTime: 35, // Stub for now
  };

  const [updateOutcome, { isLoading: isUpdating }] =
    useUpdateCommunicationOutcomeMutation();

  const handleUpdateOutcome = async (outcomeData) => {
    console.log(selectedCommunication, "-------------------------------------------------");
    let payload = {
      result: outcomeData.type,
      description: outcomeData.description,
      actions: outcomeData.actions || [],
      offerUpdates: {}
    };

    if (outcomeData.type === "TIMELINE_AGREED") {
      payload.offerUpdates = {
        postponedOfferId: outcomeData.postponedOfferId,
        newJoinDate: outcomeData.newJoinDate
      };
    } else if (outcomeData.type === "WITHDRAW_OFFER" || outcomeData.type === "CANDIDATE_WITHDREW") {
      payload.result = "CANDIDATE_WITHDREW"; // normalize type
      payload.actions = [];
      payload.offerUpdates = {
        withdrawnOfferId: outcomeData.withdrawnOfferId,
        reason: outcomeData.reason
      };
    }

    try {
      await updateOutcome({
        communicationId: selectedCommunication.id,
        outcomeData: payload,
      }).unwrap();

      setShowOutcomeModal(false);
      setSelectedCommunication(null);
    } catch (error) {
      console.error("Failed to update outcome:", error);
    }
  };

  if (isLoading) return <div>Loading communications...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            WhatsApp Communications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage HR coordination conversations
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn-whatsapp">
            <MessageCircle className="h-4 w-4 mr-2" />
            New Communication
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-5">
              <p className="text-sm text-gray-500">Total Communications</p>
              <p className="text-lg font-medium text-gray-900">
                {summaryStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-5">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-lg font-medium text-gray-900">
                {summaryStats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-5">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-lg font-medium text-gray-900">
                {summaryStats.resolved}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-primary-600" />
            <div className="ml-5">
              <p className="text-sm text-gray-500">Avg Response</p>
              <p className="text-lg font-medium text-gray-900">
                {summaryStats.averageResponseTime}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="INITIATED">Active (Initiated)</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="INITIATOR">Initiated by Me</option>
            <option value="RECIPIENT">Received</option>
          </select>
        </div>
      </div>

      {/* Communication Cards */}
      <div className="space-y-4">
        {filteredCommunications.map((communication) => (
          <div key={communication.id} className="card p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {communication.candidate.name}
                  </h3>
                  <span
                    className={`badge ${getStatusColor(
                      communication.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(communication.status)}
                    {getDisplayStatus(communication.status)}
                  </span>
                  <span className={`badge ${getRoleColor(communication.role)}`}>
                    {communication.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>
                    {communication.role === "INITIATOR" ? "To" : "From"}:{" "}
                    {communication.otherParty.name}
                  </span>
                  <span>{communication.otherParty.company}</span>
                </div>
                 {communication.outcome&& (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-900 mb-1">Resolution Outcome</h4>
                    <p className="text-sm text-green-800">{communication.outcome.description}</p>
                    {communication.outcome.actions && communication.outcome.actions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-green-900 mb-1">Agreed Actions:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          {communication.outcome.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-green-600">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-500 flex gap-4">
                  <span>
                    <Calendar className="inline w-4 h-4 mr-1" />
                    {formatTimeAgo(communication.createdAt)}
                  </span>
                  {communication.metrics.responseTimeMinutes && (
                    <span>
                      <Clock className="inline w-4 h-4 mr-1" />
                      Response: {communication.metrics.responseTimeMinutes}m
                    </span>
                  )}
                  {communication.metrics.resolutionTimeHours && (
                    <span>
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                      Resolved: {communication.metrics.resolutionTimeHours}h
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={generateWhatsAppLink(communication)}
                  className="btn-whatsapp text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
                {communication.status === "INITIATED" && (
                  <button
                    className="btn-primary text-sm"
                    onClick={() => {
                      setSelectedCommunication(communication);
                      setShowOutcomeModal(true);
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Outcome"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No communications found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter !== "ALL" || roleFilter !== "ALL"
              ? "Try adjusting your filters."
              : "Start coordinating with other HRs when you find duplicate candidates."}
          </p>
        </div>
      )}

      {showOutcomeModal && selectedCommunication && (
        <UpdateOutcomeModal
          communication={selectedCommunication}
          onClose={() => {
            setShowOutcomeModal(false);
            setSelectedCommunication(null);
          }}
          onSubmit={handleUpdateOutcome}
        />
      )}
    </div>
  );
};

export default Communications;
