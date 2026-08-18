import { Users, LayoutTemplate, MapPin } from 'lucide-react';

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{room.roomNumber}</h3>
          <p className="text-indigo-100 flex items-center gap-1 text-sm mt-1">
            <MapPin className="w-3 h-3" /> {room.building} (Floor {room.floor})
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            room.status === 'Available' ? 'bg-emerald-400 text-emerald-900' :
            room.status === 'Maintenance' ? 'bg-amber-400 text-amber-900' :
            'bg-gray-400 text-gray-900'
        }`}>
          {room.status}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{room.capacity}</span> seats
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm capitalize">
                <LayoutTemplate className="w-4 h-4 text-gray-400" />
                {room.roomType}
            </div>
        </div>

        <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-1.5">
                {room.amenities.length > 0 ? room.amenities.map(amenity => (
                    <span key={amenity} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {amenity}
                    </span>
                )) : (
                    <span className="text-sm text-gray-400">None</span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
