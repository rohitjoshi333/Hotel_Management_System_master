import React from "react";

type StaticFormProps = {
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
  guests: number;
  setGuests: (n: number) => void;
  onSearch: () => void;
};

const roomOptions = ["All", "Single", "Double", "Suite", "Family Suite"];

function StaticForm({ selectedRoom, setSelectedRoom, guests, setGuests, onSearch }: StaticFormProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div
      className="absolute lg:top-[63%] md:top-[67%] left-1/2 transform -translate-x-1/2
        bg-[var(--color-secondary)]/30 backdrop-blur-md p-4 md:p-6 rounded-xl z-40
        w-[95%] sm:w-[90%] md:w-[800px]"
    >
      <div className="flex flex-wrap md:flex-nowrap justify-between">
        {/* Check-in */}
        <div className="flex flex-col w-[48%] sm:w-[48%] md:w-[140px]">
          <label htmlFor="in" className="text-[var(--color-accent)] mb-1 text-sm">Check-in Date</label>
          <input type="date" id="in" className="p-2 rounded text-sm bg-[var(--color-accent)]/70" />
        </div>

        {/* Check-out */}
        <div className="flex flex-col w-[48%] sm:w-[48%] md:w-[140px]">
          <label htmlFor="out" className="text-[var(--color-accent)] mb-1 text-sm">Check-out Date</label>
          <input type="date" id="out" className="p-2 rounded text-sm bg-[var(--color-accent)]/70" />
        </div>

        {/* Room Category */}
        <div className="flex flex-col w-[48%] sm:w-[48%] md:w-[140px] relative">
          <label className="text-[var(--color-accent)] mb-1 text-sm">Room Category</label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-2 rounded text-left text-sm bg-[var(--color-accent)]/70"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedRoom || "Select Room"}
            </button>
            {dropdownOpen && (
              <ul className="absolute w-full bg-[var(--color-accent)] border border-[var(--color-secondary-light)] rounded mt-1 max-h-40 overflow-auto shadow-lg z-50 text-sm">
                {roomOptions.map((room) => (
                  <li
                    key={room}
                    className="p-1 hover:bg-[var(--color-secondary-light)] cursor-pointer"
                    onClick={() => {
                      setSelectedRoom(room);
                      setDropdownOpen(false);
                    }}
                  >
                    {room}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-col w-[48%] sm:w-[48%] md:w-[140px]">
          <label htmlFor="guest" className="text-[var(--color-accent)] mb-1 text-sm">Guests</label>
          <input
            type="number"
            id="guest"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="p-2 rounded text-sm bg-[var(--color-accent)]/70"
          />
        </div>

        {/* Search Button */}
        <div className="w-full sm:w-[100%] md:w-[140px] mt-2 md:mt-6 text-center">
          <button
            className="bg-red-600 text-[var(--color-accent)] p-2 rounded hover:bg-red-700 text-sm w-full transition cursor-pointer"
            onClick={onSearch}
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
}

export default StaticForm;
