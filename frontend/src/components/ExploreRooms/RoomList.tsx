import { useEffect, useMemo, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import RoomFilter from "../RoomsFilter/RoomFilter";
import ResponsiveRoomFilter from "../RoomsFilter/ResponsiveRoomFilter";
import { FaArrowRight } from "react-icons/fa";
import type { Room } from "../../constants/types";
import { fetchRooms } from "../../services/hotelApi";

const DRAWER_WIDTH = 300;

const RoomsList = ({ searchParams }: { searchParams: { roomType: string; guests: number } }) => {
  const [budget, setBudget] = useState(25000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [bedPreferences, setBedPreferences] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filtering logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room: Room) => {
      if (searchParams.roomType && searchParams.roomType !== "All" && room.type !== searchParams.roomType) return false;
      if (searchParams.guests && room.guests < searchParams.guests) return false;
      if (!room.availability) return false;
      if (room.price > budget) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => room.amenities.includes(a))) return false;
      if (selectedRoomTypes.length && !selectedRoomTypes.includes(room.type)) return false;
      if (bedPreferences.length && !bedPreferences.includes(room.bedPreference)) return false;
      return true;
    });
  }, [rooms, searchParams, budget, selectedAmenities, selectedRoomTypes, bedPreferences]);

  const currentRooms = filteredRooms.slice(0, visibleCount);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const fetched = await fetchRooms();
        setRooms(fetched);
      } catch (error: any) {
        setRoomsError(error?.message || "Unable to load rooms from server.");
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < filteredRooms.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 7);
            setIsLoading(false);
          }, 800);
        }
      },
      { threshold: 1.0 }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => observer.disconnect();
  }, [isLoading, filteredRooms.length]);

  // 👇 Detect when the expanded button leaves the viewport
  useEffect(() => {
    const target = buttonRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // compact = expanded button is NOT visible
        setIsCompact(!entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container flex gap-6 p-6 max-w-6xl mx-auto justify-center">
      {/* Sidebar filter for desktop */}
      <div className="hidden md:block lg:min-w-[23%]">
        <div className="sticky top-[75px]">
          <RoomFilter
            budget={budget}
            setBudget={setBudget}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            selectedRoomTypes={selectedRoomTypes}
            setSelectedRoomTypes={setSelectedRoomTypes}
            bedPreferences={bedPreferences}
            setBedPreferences={setBedPreferences}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative p-3">
        {/* Full-width (expanded) filter button */}
        <button
          ref={buttonRef}
          onClick={() => setShowFilter((prev) => !prev)}
          className="md:hidden flex items-center gap-2 text-white font-semibold shadow-md transition-all duration-300 w-full p-3 rounded-lg text-lg mb-4"
          style={{ background: "var(--color-primary)" }}
        >
          <FaArrowRight className={`transition-transform duration-300 ${showFilter ? "rotate-180" : ""}`} />
          <span>Show Filters</span>
        </button>

        {/* Compact floating button (only when expanded button is off-screen) */}
        {isCompact && (
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="md:hidden fixed left-0 top-[90px] p-3 rounded-r-xl text-white font-semibold shadow-md transition-all duration-300"
            style={{
              background: "var(--color-primary)",
              transform: showFilter ? `translateX(${DRAWER_WIDTH}px)` : "translateX(0)",
              zIndex: 30,
            }}
          >
            <FaArrowRight className={`transition-transform duration-300 ${showFilter ? "rotate-180" : ""}`} />
          </button>
        )}

        {/* Room cards */}
        {roomsError && <p className="text-center text-red-600 mb-2">{roomsError}</p>}
        {loadingRooms ? (
          <p className="text-center text-[var(--color-secondary)]">Loading rooms...</p>
        ) : currentRooms.length > 0 ? (
          currentRooms.map((room: Room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <p className="text-center text-[var(--color-secondary)]">No rooms match your filters.</p>
        )}

        {/* Loader */}
        {visibleCount < filteredRooms.length && (
          <div ref={loaderRef} className="h-10 flex justify-center items-center">
            {isLoading && (
              <div className="animate-spin border-4 border-[var(--color-primary)] border-t-transparent rounded-full w-6 h-6"></div>
            )}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <ResponsiveRoomFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        budget={budget}
        setBudget={setBudget}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        selectedRoomTypes={selectedRoomTypes}
        setSelectedRoomTypes={setSelectedRoomTypes}
        bedPreferences={bedPreferences}
        setBedPreferences={setBedPreferences}
      />
    </div>
  );
};

export default RoomsList;
