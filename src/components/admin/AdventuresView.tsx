import React, { useState } from 'react';
import { Compass, MapPin, Calendar, DollarSign, Search } from 'lucide-react';
import AddAdventureModal from './AddAdventureModal';

const initialAdventures = [
  { id: 1, name: 'Fitness First Membership', category: 'Gym', price: '$49/mo', vendor: 'Fitness First', status: 'active', bookings: 234 },
  { id: 2, name: 'Hoyts Cinema Tickets', category: 'Entertainment', price: '$15', vendor: 'Hoyts', status: 'active', bookings: 567 },
  { id: 3, name: 'Concert: Live Nation', category: 'Events', price: '$89', vendor: 'Live Nation', status: 'active', bookings: 123 },
  { id: 4, name: 'Anytime Fitness Pass', category: 'Gym', price: '$39/mo', vendor: 'Anytime Fitness', status: 'active', bookings: 189 },
];

export default function AdventuresView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [adventures, setAdventures] = useState(initialAdventures);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAdventure = (newAdventure: any) => {
    setAdventures([...adventures, newAdventure]);
  };

  const filteredAdventures = adventures.filter(adv =>
    adv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adv.category.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Applaza Adventures</h1>
        <p className="text-gray-400">Manage experiences, memberships, and event listings</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
          <Compass className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">87</div>
          <div className="text-gray-400">Active Listings</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
          <Calendar className="w-8 h-8 text-blue-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">1,113</div>
          <div className="text-gray-400">Total Bookings</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <DollarSign className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">$45.2K</div>
          <div className="text-gray-400">Revenue</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <MapPin className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">23</div>
          <div className="text-gray-400">Vendor Partners</div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search adventures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Add Adventure
        </button>

      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Name</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Category</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Vendor</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Price</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Bookings</th>
              <th className="text-left p-4 text-gray-400 font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdventures.map(adv => (

              <tr key={adv.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                <td className="p-4 text-white font-semibold">{adv.name}</td>
                <td className="p-4 text-gray-300">{adv.category}</td>
                <td className="p-4 text-gray-300">{adv.vendor}</td>
                <td className="p-4 text-green-400 font-semibold">{adv.price}</td>
                <td className="p-4 text-white">{adv.bookings}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    {adv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddAdventureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAdventure}
      />
    </div>

  );
}
