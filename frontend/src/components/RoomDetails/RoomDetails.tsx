import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Gallery from "./Gallery";
import RoomInfoSidebar from "./RoomInfoSidebar";
import RoomInfoSections from "./RoomInfoSections";
import type { Room } from "../../constants/types";
import { fetchRoomById } from "../../services/hotelApi";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) return;
      try {
        const fetched = await fetchRoomById(Number(id));
        setRoom(fetched);
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 mt-[10%]">
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 mt-[10%]">
        Room not found!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-6 max-w-7xl mx-auto mt-15">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-[var(--color-secondary)] px-6 py-2 rounded-lg border border-[var(--color-secondary-light)] hover:bg-[var(--color-secondary-light)] transition cursor-pointer mb-3"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-2 w-full h-full mb-4">
          {/* Gallery */}
          <Gallery room={room} />

          {/* Room Info Sidebar */}
          <RoomInfoSidebar room={room} />
        </div>

        {/* Room Info Sections */}
        <RoomInfoSections room={room} />
      </div>
    </div>
  );
}
