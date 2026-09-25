import React, { useState, useEffect } from 'react';
import { Building, Plus, Calendar, Edit, Trash2, Layers, Search } from 'lucide-react';
import { AdminBookings } from './AdminBookings';
import ApartmentForm from '../../components/admin/ApartmentForm';
import { fetchApartments, createApartment, updateApartment, deleteApartment } from '../../services/api';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('apartments'); // 'apartments' | 'bookings'
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal & Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTower, setSelectedTower] = useState('All');

  // Fetch apartments on mount
  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchApartments();
      // Handle both API responses: { success: true, data: [...] } or direct array [...]
      const data = response?.data || response || [];
      setApartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch apartments:', err);
      setError('Failed to load apartments. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingApartment(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (apartment) => {
    setEditingApartment(apartment);
    setIsFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditingApartment(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingApartment?._id) {
        await updateApartment(editingApartment._id, formData);
      } else {
        await createApartment(formData);
      }
      handleCloseModal();
      loadApartments();
    } catch (err) {
      console.error('Failed to save apartment:', err);
      alert(err?.response?.data?.message || 'Error saving apartment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this apartment?')) return;

    try {
      await deleteApartment(id);
      loadApartments();
    } catch (err) {
      console.error('Failed to delete apartment:', err);
      alert('Failed to delete apartment.');
    }
  };

  // Filter apartments based on search term and tower
  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch = apt.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTower = selectedTower === 'All' || apt.tower === selectedTower;
    return matchesSearch && matchesTower;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage listings, view reservations, and update features.</p>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === 'apartments' && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
              >
                <Plus size={18} />
                <span>Add Apartment</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white px-6 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('apartments')}
            className={`flex items-center space-x-2 py-4 px-4 font-medium text-sm border-b-2 transition ${
              activeTab === 'apartments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building size={18} />
            <span>Apartments ({apartments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 py-4 px-4 font-medium text-sm border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} />
            <span>Bookings</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'apartments' ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="relative w-full sm:w-72">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Layers size={18} className="text-gray-400" />
                <select
                  value={selectedTower}
                  onChange={(e) => setSelectedTower(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Towers</option>
                  <option value="Tower 1">Tower 1</option>
                  <option value="Tower 2">Tower 2</option>
                  <option value="Tower 3">Tower 3</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            {/* Loading / Apartments Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading apartments...</div>
            ) : filteredApartments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl text-gray-500">
                No apartments found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApartments.map((apt) => (
                  <div
                    key={apt._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition"
                  >
                    <div className="h-48 bg-gray-100 relative">
                      {apt.images && apt.images.length > 0 ? (
                        <img
                          src={apt.images[0]}
                          alt={apt.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
                        {apt.tower}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{apt.title}</h3>
                        <p className="text-blue-600 font-bold text-lg mt-1">
                          ${apt.pricePerNight}{' '}
                          <span className="text-xs text-gray-500 font-normal">/ night</span>
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-3">
                          <span>{apt.bedrooms} Bed</span>
                          <span>•</span>
                          <span>{apt.bathrooms} Bath</span>
                          <span>•</span>
                          <span>{apt.guests} Guests</span>
                          {apt.sizeSqM && (
                            <>
                              <span>•</span>
                              <span>{apt.sizeSqM} sqm</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleOpenEditModal(apt)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Apartment"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteApartment(apt._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Apartment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Bookings Tab */
          <AdminBookings />
        )}

        {/* Modal for Apartment Form */}
        <ApartmentForm
          isOpen={isFormOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={editingApartment}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default Admin;