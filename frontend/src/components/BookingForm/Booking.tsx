import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "./Form";
import Invoice from "./Invoice";
import type { Room } from "../../constants/types";
import { createBooking, fetchRoomById } from "../../services/hotelApi";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) return;
      try {
        const fetched = await fetchRoomById(Number(id));
        if (!fetched) {
          setError("Room not found");
        }
        setRoom(fetched);
      } catch (err: any) {
        setError(err?.message || "Unable to load room");
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  useEffect(() => {
    if (!room || bookingDetails) return; // stop gallery when invoice is shown

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % room.gallery.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [room, bookingDetails]);

  const handleBookingSubmit = async (details: any) => {
    if (!room) return;
    const token = localStorage.getItem("token");
    try {
      const bookingResponse = await createBooking(
        {
          roomId: room.id,
          checkIn: details.arrivalDate,
          checkOut: details.departureDate,
          guests: details.guests,
        },
        token || ""
      );

      setBookingDetails({
        ...details,
        bookingId: bookingResponse.id,
        status: bookingResponse.status,
        roomNumber: bookingResponse.room_detail?.number || room.id,
      });
    } catch (err: any) {
      alert(err?.message || "Unable to complete booking. Please try again.");
      if (err?.message?.toLowerCase().includes("log in")) {
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 mt-[10%]">
        Loading booking details...
      </div>
    );
  }

  if (!room || error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 mt-[10%]">
        {error || "Room not found 😕"}
      </div>
    );
  }

  return (
    <div className="container">
      {!bookingDetails ? (
        <>
          <div className="mx-auto relative">
            <img
              src={room.gallery[currentIndex]}
              alt="Room"
              className="w-full h-[450px] object-cover rounded-xl shadow-lg transition-all duration-500"
            />
            <div className="flex justify-center mt-3 space-x-2">
              {room.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex ? "bg-black" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto items-center text-center">
            <h1 className="font-bold mt-5 text-3xl">Hotel Reservation Form</h1>
            <div className="text-[var(--color-secondary)] mt-0">
              Please complete the form below.
            </div>
            <div className="text-[var(--color-secondary)] mt-10 mb-5">
              Your registration will be verified prior to your arrival.
            </div>
            <Form room={room} onSubmit={handleBookingSubmit} />
          </div>
        </>
      ) : (
        <Invoice bookingDetails={bookingDetails} /> // Only invoice shown here
      )}
    </div>
  );
}

export default Booking;
