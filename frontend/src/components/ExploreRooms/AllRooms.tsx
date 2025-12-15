import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoomsList from "./RoomList";
import StaticForm from "../ExploreRooms/StaticForm";

function AllRooms() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRoom, setSelectedRoom] = useState<string>("All");
  const [guests, setGuests] = useState<number>(1);

  // Initialize state from location.state only once
  useEffect(() => {
    const { roomType, guests: locationGuests } = location.state || {};
    if (roomType) setSelectedRoom(roomType);
    if (locationGuests) setGuests(locationGuests);
  }, [location.state]);

  const handleSearch = () => {
    navigate("/allRooms", { state: { roomType: selectedRoom, guests } });
  };

  return (
    <>
      {/* Full-width Hero Section (same style as GetStarted) */}
      <div className="mx-auto">
        <section className="relative w-full h-[600px] sm:h-[550px] md:h-[650px] lg:h-[700px] bg-[var(--color-accent)] ">
          {/* Background Image */}
          <img
            src="https://i.pinimg.com/736x/b1/5f/25/b15f257289f1d06d0e4dd4fc332de429.jpg"
            alt="all-rooms-hero"
            className="w-full h-full object-cover brightness-50"
          />

          {/* Text and Form Container (constrained) */}


          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center text-center gap-6">
              <h1 className="text-[var(--color-accent)]/80 text-3xl sm:text-4xl md:text-5xl font-bold p-2">
                Explore All Rooms
              </h1>
              <p className="text-[var(--color-accent)]/80 font-semibold text-sm sm:text-base md:text-xl mt-2 max-w-2xl">
                Find the perfect room tailored to your needs and preferences.
                Choose from our wide range of luxurious and comfortable options.
              </p>
              <div className="w-full sm:w-[90%] md:w-[400px] lg:w-[500px]">
                <StaticForm
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  guests={guests}
                  setGuests={setGuests}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Rooms */}
        <div className="text-center mt-7 mx-auto">
          <h1 className="text-2xl font-bold">Featured Rooms & Suites</h1>
          <p className="text-[var(--color-secondary)] text-base p-4 ">
            Discover the perfect accommodation for your stay, from comfortable standard rooms to luxurious penthouse suites.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl px-4">
            <RoomsList searchParams={{ roomType: selectedRoom, guests }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AllRooms;
