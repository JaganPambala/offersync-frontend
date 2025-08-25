export const navigationLinks = {
  home: {
    name: "Home",
    path: "/",
  },
  login: {
    name: "Login",
    path: "/auth/login",
  },
  register: {
    name: "Register",
    path: "/auth/register",
  },
  dashboard: {
    name: "Dashboard",
    path: "/",
  },
  candidateCheck: {
    name: "Candidate Check",
    path: "/candidate/check",
  },
  manageOffer:{
    name: "Manage Offer",
    path: "/candidate/:candidateId",

  },
  offers: {
    name: "Offers",
    path: "/offers",
  },
  offerCreate: {
    name: "Create Offer",
    path: "/candidate/offers/create",
  },
  offerCreateCompetitive: {
    name: "Create Competitive Offer",
    path: "/candidate/:id/offer", // Updated to match backend endpoint pattern
  },
  communications: {
    name: "Communications",
    path: "/communications",
  },
};

export const API_URL = "http://localhost:3000/api";
