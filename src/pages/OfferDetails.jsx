import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Edit,
  Mail,
  Phone,
  Building,
  DollarSign,
  Users
} from 'lucide-react';
import { useGetOfferByIdQuery, useUpdateOfferStatusMutation } from '../redux/api/offerApiSlice';

const OfferDetails = () => {
  const { id } = useParams();
  const { data: offer, isLoading } = useGetOfferByIdQuery(id);
  const [updateStatus] = useUpdateOfferStatusMutation();
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Offer Details for {offer?.candidate?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {offer?.position?.title} • Created on {new Date(offer?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Status Badge and Edit */}
          <div className="relative">
            {isEditingStatus ? (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  {['ACTIVE', 'PENDING', 'ACCEPTED', 'EXPIRED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingStatus(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className={`inline-block w-3 h-3 rounded-full ${
                  offer?.status === 'ACTIVE' ? 'bg-blue-500' :
                  offer?.status === 'ACCEPTED' ? 'bg-green-500' :
                  offer?.status === 'EXPIRED' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></span>
                <span>{offer?.status}</span>
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Information */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Candidate Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1">{offer?.candidate?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {offer?.candidate?.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {offer?.candidate?.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Company</label>
                <p className="mt-1 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {offer?.candidate?.currentCompany}
                </p>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Offer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="mt-1">{offer?.position?.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Level</label>
                <p className="mt-1">{offer?.position?.level}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Compensation</label>
                <p className="mt-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ₹{(offer?.compensation?.total / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Valid Till</label>
                <p className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(offer?.timeline?.validTill).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Offer Timeline</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { date: offer?.createdAt, title: 'Offer Created', icon: FileText },
                  { date: offer?.timeline?.followUpDate, title: 'Follow-up Scheduled', icon: Clock },
                  { date: offer?.timeline?.validTill, title: 'Offer Expires', icon: Calendar },
                ].map((event, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      <div className="relative flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <event.icon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">{event.title}</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Competition Info */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Competition Status</h2>
            {offer?.competition?.isCompetitive ? (
              <div className="space-y-4">
                <div className="flex items-center text-orange-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Competitive Offer</span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Competitors</label>
                  <p className="mt-1">{offer?.competition?.competitorCount} other companies</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Market Position</label>
                  <p className="mt-1">{offer?.competition?.marketRank}</p>
                </div>
                <button className="btn-primary w-full mt-4">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Coordinate via WhatsApp
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">No competitive offers detected</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="btn-secondary w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </button>
              <button className="btn-secondary w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </button>
              <button className="btn-secondary w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download Offer Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails; 