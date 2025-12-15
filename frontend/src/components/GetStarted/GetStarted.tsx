import { useEffect, useState } from "react";
import { AUTH_CHANGE_EVENT } from "../../services/authUser";
import { useNavigate } from "react-router-dom";
import FeaturedRooms from "./FeaturedRooms";
import HotelServices from "./HotelServices";
import StaticForm from "../ExploreRooms/StaticForm";
import video from "../../assets/HotelCinematic.mp4";

function GetStarted() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState<string>("All");
  const [guests, setGuests] = useState<number>(1);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored) as { username?: string };
          setCurrentUserName(parsed.username || null);
        } else {
          setCurrentUserName(null);
        }
      } catch {
        setCurrentUserName(null);
      }
    };

    loadUserName();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user" || event.key === null) {
        loadUserName();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, loadUserName);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, loadUserName);
    };
  }, []);

  const handleSearch = () => {
    navigate("/allRooms", { state: { roomType: selectedRoom, guests } });
  };

  return (
    <>
      {/* Full-width Hero Section */}
      <section className="relative w-full h-[600px] sm:h-[550px] md:h-[650px] lg:h-[960px]">
        {/* Background Video */}
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-70"
        />

        {/* Text and Form Container (constrained) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
            {currentUserName && (
              <p className="text-[var(--color-accent)] text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-md tracking-wide">
                Welcome, <span className="font-black">{currentUserName}</span>
              </p>
            )}
            <h1 className="text-[var(--color-accent)]/80 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Your Comfort Our Priority
            </h1>
            <p className="text-[var(--color-accent)]/80 font-semibold text-sm sm:text-base md:text-xl mt-2 max-w-2xl">
              Experience comfort, luxury, and exceptional hospitality at our premium hotel.
              We create memorable stays for every guest with world-class amenities and service.
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
      <div className="container mx-auto px-4 text-center mt-10 md:mt-10 mb-6">
        <h1 className="text-2xl font-bold mb-2">Featured Rooms & Suites</h1>
        <p className="text-[var(--color-secondary)] text-base">
          Discover the perfect accommodation for your stay, from comfortable standard rooms to luxurious penthouse suites.
        </p>
      </div>

      <FeaturedRooms />

      {/* Explore More Button */}
      <div className="container mx-auto px-4 w-full text-center my-8">
        <button className="view-btn" onClick={() => navigate("/allRooms")}>
          Explore More
        </button>
      </div>

      <HotelServices />
    </>
  );
}

export default GetStarted;
