import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetCandidateOffersQuery,
    useDeleteOfferMutation,
} from "../redux/api/candidateApiSlice";
import {  useUpdateOfferMutation } from "../redux/api/offerApiSlice";
import { Edit3, Trash2, Calendar, Mail, Phone } from "lucide-react";
import OfferEditModal from "../components/common/OfferEditModal";

const ManageOffersPage = ({ loggedInHRCompany }) => {
  const { candidateId } = useParams(); // ✅ make sure param name matches route
  console.log("Candidate ID from params:", candidateId);

  const { data, isLoading, isError } = useGetCandidateOffersQuery(candidateId);
  const [updateOffer] = useUpdateOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [selectedOffer, setSelectedOffer] = useState(null);

  if (isLoading) return <div className="text-center p-6">Loading...</div>;
  if (isError || !data?.candidate) return <div className="text-red-500 p-6">Error fetching data</div>;

  const candidate = data.candidate;
  const offers = data?.offers?.filter((o) => o.company === loggedInHRCompany) || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      await deleteOffer(id).unwrap(); // ✅ safer
    }
  };

  const handleUpdateOffer = async (updatedData) => {
    try {
      await updateOffer(updatedData).unwrap();
      setSelectedOffer(null);
    } catch (error) {
      if (error?.data?.message === "You are not authorized to update this offer.") {
        alert("You are not authorized to update this offer.");
      } else {
        alert("Failed to update offer. Please try again.");
      }
      console.error("Failed to update offer:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Candidate Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
        <div className="text-gray-600 flex items-center gap-3">
          <Mail className="h-4 w-4" /> {candidate.email}
          <Phone className="h-4 w-4 ml-4" /> {candidate.phone}
        </div>
      </div>

      {/* Offers */}
      <h3 className="text-lg font-medium mb-4">Offers from {loggedInHRCompany}</h3>
      <div className="space-y-4">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gray-50 rounded-lg shadow-sm p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">
                  {offer.position.title} ({offer.position.level})
                </h4>
                <p className="text-sm text-gray-600">{offer.salary}</p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {offer.status}
                </p>
                <p className="text-sm flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" /> Valid Till: {offer.timeline.validTill}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No offers from {loggedInHRCompany} for this candidate.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {selectedOffer && (
        <OfferEditModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onUpdate={handleUpdateOffer} // ✅ fixed handler
        />
      )}
    </div>
  );
};

export default ManageOffersPage;
