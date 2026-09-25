import React, { useState } from 'react';

export default function ImageUpload({ onImageUploaded }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  // Replace with your actual Cloudinary credentials
  const CLOUD_NAME = 'YOUR_CLOUD_NAME'; 
  const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUploaded(data.secure_url); // Pass URL back to parent form
      }
    } catch (err) {
      console.error('Cloudinary Upload Failed:', err);
      alert('Failed to upload image to Cloudinary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Apartment Image (Cloudinary)</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileUpload} 
        className="w-full text-sm border p-2 rounded-lg bg-transparent"
      />

      {loading && <p className="text-xs text-blue-500">Uploading to Cloudinary...</p>}

      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Uploaded preview" className="h-32 w-full object-cover rounded-lg border" />
          <p className="text-xs text-green-600 mt-1">✓ Cloudinary URL Generated</p>
        </div>
      )}
    </div>
  );
}