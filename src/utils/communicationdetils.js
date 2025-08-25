// utils/getCandidateCommunication.js

export const getCandidateCommunication = (candidatesData, candidateId) => {
  const candidateObj = candidatesData.find(
    (c) => c.candidate.id === candidateId
  );

  if (!candidateObj) return null;

  const candidateInfo = candidateObj.candidate;
  const allOffers = candidateObj.offers || [];

  const user = localStorage.getItem("user");
  const loggedInHRId = user ? JSON.parse(user)._id : null;

  const initiatorOffer = allOffers.find(
    (offer) => offer.hr.id === loggedInHRId
  );
  const recipientOffer = allOffers.find(
    (offer) => offer.hr.id !== loggedInHRId
  );

  return {
    candidateInfo,
    initiatorOffer,
    recipientOffer,
  };
};
