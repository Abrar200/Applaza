import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddAdventureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (adventure: any) => void;
}

export default function AddAdventureModal({ isOpen, onClose, onAdd }: AddAdventureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gym',
    vendor: '',
    price: '',
    description: '',
    videoUrl: '',
    location: '',
    availability: 'unlimited'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      vendor: formData.vendor,
      price: formData.price,
      status: 'active',
      bookings: 0,
      description: formData.description,
      videoUrl: formData.videoUrl,
      location: formData.location
    });
    setFormData({
      name: '',
      category: 'Gym',
      vendor: '',
      price: '',
      description: '',
      videoUrl: '',
      location: '',
      availability: 'unlimited'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Adventure</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Adventure Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              placeholder="e.g. Fitness First Membership"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                <option>Gym</option>
                <option>Entertainment</option>
                <option>Events</option>
                <option>Wellness</option>
                <option>Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Vendor</label>
              <input
                type="text"
                required
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                placeholder="e.g. Fitness First"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Price</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                placeholder="e.g. $49/mo or $89"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                placeholder="e.g. Sydney CBD"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-24"
              placeholder="Describe the adventure or experience..."
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Video URL</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold"
            >
              Add Adventure
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
