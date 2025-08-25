import React, { useState } from "react";
import {
  FileText,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOffersQuery,
  useUpdateOfferMutation,
} from "../redux/api/offerApiSlice";
import { navigationLinks } from "../utils/constants.js";
import OfferEditModal from "../components/common/OfferEditModal";
import { useCreateCommunicationMutation } from "../redux/api/communicationApiSlice.js";
import { getCandidateCommunication } from "../utils/communicationdetils.js";

const Offers = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCandidates, setExpandedCandidates] = useState({});
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [createCommunication] = useCreateCommunicationMutation();

  const { data: response, isLoading, isError } = useGetAllOffersQuery();

  const [updateOffer] = useUpdateOfferMutation();

  // Add detailed logging
  console.log("Raw API Response:", response);

  // Safely handle the response data - ensure we're getting the data array from the response
  const candidatesData = response?.success ? response.data : [];
  console.log("Processed candidatesData:", candidatesData);

  const user = localStorage.getItem("user");
  const loggedInHRId = user ? JSON.parse(user)._id : null;

  // Toggle candidate expansion
  const toggleCandidate = (candidateId) => {
    setExpandedCandidates((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };

  // Filter candidates based on search and status
  const filteredCandidates = candidatesData.filter((candidateData) => {
    console.log("Filtering candidate:", candidateData);
    const matchesSearch =
      searchTerm === "" ||
      candidateData?.candidate?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;

    return (
      matchesSearch &&
      candidateData?.offers?.some((offer) => offer.status === statusFilter)
    );
  });

  console.log("Filtered Candidates:", filteredCandidates);

  // Calculate stats based on all offers across all candidates
  const statsData = {
    total: candidatesData.reduce(
      (acc, curr) => acc + (curr?.offers?.length || 0),
      0
    ),
    active: candidatesData.reduce(
      (acc, curr) =>
        acc + (curr?.offers?.filter((o) => o.status === "ACTIVE")?.length || 0),
      0
    ),
    onHold: candidatesData.reduce(
      (acc, curr) =>
        acc +
        (curr?.offers?.filter((o) => o.status === "ON_HOLD")?.length || 0),
      0
    ),
    accepted: candidatesData.reduce(
      (acc, curr) =>
        acc +
        (curr?.offers?.filter((o) => o.status === "ACCEPTED")?.length || 0),
      0
    ),
  };

  console.log("Stats Data:", statsData);

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const handleCreateOffer = () => {
    navigate(navigationLinks.offerCreate.path);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
  };

  const handleUpdateOffer = async (updatedData) => {
    try {
      await updateOffer(updatedData).unwrap();
      setSelectedOffer(null); // Close modal on success
    } catch (error) {
      console.error("Failed to update offer:", error);
      if (
        error?.data?.message === "You are not authorized to update this offer."
      ) {
        alert("You are not authorized to update this offer.");
      } else {
        alert("Failed to update offer. Please try again.");
      }
      console.error("Failed to update offer:", error);
      // You might want to show an error message to the user hereww
    }
  };

  // Initiate WhatsApp communication for the correct candidate
  const handleInitiateAndOpenWhatsApp = async (candidateName, candidateId) => {
    // Find the correct candidateData
    const candidateData = candidatesData.find(
      (c) => c.candidate.id === candidateId
    );
    if (!candidateData) return;

    const candidateInfo = candidateData.candidate || {};
    const allOffers = candidateData.offers || [];

    const initiatorOffer = allOffers.find(
      (offer) => offer.hr.id === loggedInHRId
    );
    const recipientOffer = allOffers.find(
      (offer) => offer.hr.id !== loggedInHRId
    );

    if (!initiatorOffer || !recipientOffer) {
      alert("Both offers must be present to initiate communication.");
      return;
    }

    const whatsappPayload = {
      initiatorHR: {
        _id: initiatorOffer.hr.id,
        name: initiatorOffer.hr.name,
        whatsapp: initiatorOffer.hr.whatsapp,
        company: initiatorOffer.hr.company,
      },
      recipientHR: {
        _id: recipientOffer.hr.id,
        name: recipientOffer.hr.name,
        whatsapp: recipientOffer.hr.whatsapp,
        company: recipientOffer.hr.company,
      },
      candidate: {
        _id: candidateInfo.id,
        name: candidateInfo.name,
      },
      offers: [
        {
          _id: initiatorOffer.id,
          position: initiatorOffer.position,
          company: initiatorOffer.hr.company,
          hr: {
            _id: initiatorOffer.hr.id,
            name: initiatorOffer.hr.name,
          },
        },
        {
          _id: recipientOffer.id,
          position: recipientOffer.position,
          company: recipientOffer.hr.company,
          hr: {
            _id: recipientOffer.hr.id,
            name: recipientOffer.hr.name,
          },
        },
      ],
    };

    try {
      const response = await createCommunication(whatsappPayload).unwrap();
      console.log("Communication created:", response);
      if (response?.data?.whatsappLink) {
        window.open(response.data.whatsappLink, "_blank");
      } else {
        alert("WhatsApp link not found in response.");
      }
    } catch (error) {
      console.error("Failed to create communication:", error);
      alert("Failed to initiate WhatsApp communication.");
    }
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading offers. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Offers Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your job offers in one place
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn-primary" onClick={handleCreateOffer}>
            <FileText className="h-4 w-4 mr-2" />
            Create Offer
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Offers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statsData.total}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  On Hold
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statsData.onHold}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Accepted
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statsData.accepted}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statsData.active}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates with Offers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidateData) => (
                <React.Fragment key={candidateData.candidate.id}>
                  {/* Main Candidate Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            toggleCandidate(candidateData.candidate.id)
                          }
                          className="mr-2 focus:outline-none"
                        >
                          {expandedCandidates[candidateData.candidate.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {candidateData.candidate.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {candidateData.candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {candidateData.offers.length} offers
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              navigationLinks.manageOffer.path.replace(
                                ":candidateId",
                                candidateData.candidate.id
                              )
                            )
                          }
                          className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                        >
                          Manage Offers
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Offers Section */}
                  {expandedCandidates[candidateData.candidate.id] && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {candidateData.offers.map((offer) => {
                            // Check if candidate joined elsewhere
                            const candidateJoined =
                              candidateData.candidate.status === "JOINED";
                            // Check if candidate accepted another offer
                            const acceptedElsewhere = candidateData.offers.some(
                              (o) => o.status === "ACCEPTED"
                            );
                            // Tooltip logic
                            let editTooltip = "";
                            let editDisabled = false;
                            if (offer.status === "EXPIRED" || candidateJoined) {
                              editTooltip =
                                "Candidate already joined another company";
                              editDisabled = true;
                            } else if (
                              offer.status === "REJECTED" &&
                              acceptedElsewhere
                            ) {
                              editTooltip = "Candidate accepted another offer";
                              // Optionally, you can disable or just show tooltip
                              // editDisabled = true;
                            }

                            return (
                              <div
                                key={offer.id}
                                className="bg-white p-4 rounded-lg shadow border border-gray-200"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {offer.position.title}
                                      </h4>
                                      <span className="text-xs text-gray-500">
                                        ({offer.position.level})
                                      </span>
                                      <span
                                        className={`badge ${getStatusColor(
                                          offer.status
                                        )}`}
                                      >
                                        {offer.status}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      <span>
                                        Offered by: {offer.hr.name} at{" "}
                                        {offer.hr.company}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <span>
                                        {formatCurrency(
                                          offer.compensation.total
                                        )}
                                      </span>

                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Valid till:{" "}
                                        {new Date(
                                          offer.timeline.validTill
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {candidateData.offers.length > 1 &&
                                      offer.hr?.id !== loggedInHRId && (
                                        <button
                                          onClick={() =>
                                            handleInitiateAndOpenWhatsApp(
                                              candidateData.candidate.name,
                                              candidateData.candidate.id
                                            )
                                          }
                                          className="text-green-600 hover:text-green-800"
                                        >
                                          <MessageCircle className="h-5 w-5" />
                                        </button>
                                      )}

                                    <button
                                      onClick={() => handleEditOffer(offer)}
                                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                      disabled={editDisabled}
                                      title={editTooltip || "Edit Offer"}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No candidates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search or filters."
              : "Get started by creating a new offer."}
          </p>
        </div>
      )}
      {selectedOffer && (
        <OfferEditModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onUpdate={handleUpdateOffer}
        />
      )}
    </div>
  );
};

export default Offers;
