import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

const ApartmentForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    tower: 'Tower 1',
    pricePerNight: '',
    floor: '',
    bedrooms: '1',
    bathrooms: '1',
    guests: '1',
    sizeSqM: '',
    amenities: '',
    description: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        tower: initialData.tower || 'Tower 1',
        pricePerNight: initialData.pricePerNight || initialData.price || '',
        floor: initialData.floor || '',
        bedrooms: initialData.bedrooms || '1',
        bathrooms: initialData.bathrooms || '1',
        guests: initialData.guests || '1',
        sizeSqM: initialData.sizeSqM || '',
        amenities: Array.isArray(initialData.amenities)
          ? initialData.amenities.join(', ')
          : initialData.amenities || '',
        description: initialData.description || '',
      });
      setExistingImages(initialData.images || []);
    } else {
      setFormData({
        title: '',
        tower: 'Tower 1',
        pricePerNight: '',
        floor: '',
        bedrooms: '1',
        bathrooms: '1',
        guests: '1',
        sizeSqM: '',
        amenities: '',
        description: '',
      });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setFilePreviews([]);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('tower', formData.tower);
    data.append('pricePerNight', formData.pricePerNight);
    data.append('floor', formData.floor);
    data.append('bedrooms', formData.bedrooms);
    data.append('bathrooms', formData.bathrooms);
    data.append('guests', formData.guests);
    data.append('sizeSqM', formData.sizeSqM);
    data.append('description', formData.description);

    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    data.append('amenities', JSON.stringify(amenitiesArray));
    data.append('existingImages', JSON.stringify(existingImages));

    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative flex flex-col w-full max-w-lg max-h-[85vh] rounded-xl bg-white shadow-2xl overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b px-5 py-3 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-800">
            {initialData ? 'Edit Apartment' : 'Add New Apartment'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Luxury Sea View Suite"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Tower & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tower
              </label>
              <select
                name="tower"
                value={formData.tower}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Tower 1">Tower 1</option>
                <option value="Tower 2">Tower 2</option>
                <option value="Tower 3">Tower 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price per Night ($) *
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                required
                placeholder="150"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Floor, Bedrooms, Bathrooms, Guests */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="5"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="1"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="1"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                placeholder="1"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Size & Amenities */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Size (sqm)
              </label>
              <input
                type="number"
                name="sizeSqM"
                value={formData.sizeSqM}
                onChange={handleChange}
                placeholder="120"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="WiFi, Pool, Sea View"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description..."
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {(existingImages.length > 0 || filePreviews.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {existingImages.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative h-10 w-10 rounded overflow-hidden border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"
                    >
                      <Trash2 size={8} />
                    </button>
                  </div>
                ))}
                {filePreviews.map((src, idx) => (
                  <div key={`new-${idx}`} className="h-10 w-10 rounded overflow-hidden border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed Footer Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-blue-600 text-xs font-medium text-white hover:bg-blue-700"
            >
              {initialData ? 'Update Apartment' : 'Save Apartment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApartmentForm;