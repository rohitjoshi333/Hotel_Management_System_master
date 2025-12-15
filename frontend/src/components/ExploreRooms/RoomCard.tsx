import { useNavigate } from "react-router-dom";
import type { Room } from "../../constants/types";
import { CheckCircle, XCircle } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  const handleBookNow = (roomId: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/booking/${roomId}`);
    } else {
      alert("Please log in or sign up first.");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-full bg-white shadow-lg rounded-xl overflow-hidden mb-8 hover:shadow-2xl transition-shadow border border-[var(--color-secondary-light)] mx-auto">
      {/* Room Image */}
      <img
        src={room.image}
        alt={room.type}
        className="w-full lg:w-1/3 h-64 md:h-auto object-cover"
      />

      {/* Room Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Top Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{room.type} Room</h2>
          <p className="text-[var(--color-secondary)] mb-4">{room.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-[var(--color-secondary-light)] px-3 py-1 rounded-full text-[var(--color-secondary)] text-sm">
              Guests: {room.guests}
            </span>
            <span className="bg-[var(--color-secondary-light)] px-3 py-1 rounded-full text-[var(--color-secondary)] text-sm">
              Price: NPR {room.price.toLocaleString()}/night
            </span>
            <span className="bg-[var(--color-secondary-light)] px-3 py-1 rounded-full text-[var(--color-secondary)] text-sm flex items-center gap-1">
              Availability: {room.availability ? (
                <CheckCircle className="text-green-500 w-4 h-4" />
              ) : (
                <XCircle className="text-red-500 w-4 h-4" />
              )}
            </span>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h3 className="font-semibold text-[var(--color-secondary)] mb-2">Amenities:</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-[var(--color-secondary-light)] text-[var(--color-secondary)] px-2 py-1 rounded text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            className="view-btn"
            onClick={() => navigate(`/rooms/${room.id}`)}
          >
            View Details
          </button>
          <button
            className="book-btn"
            onClick={() => handleBookNow(room.id)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
