interface RoomFilterProps {
  budget: number;
  setBudget: (value: number) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
  selectedRoomTypes: string[];
  setSelectedRoomTypes: (value: string[]) => void;
  bedPreferences: string[];
  setBedPreferences: (value: string[]) => void;
}

const RoomFilter: React.FC<RoomFilterProps> = ({
  budget,
  setBudget,
  selectedAmenities,
  setSelectedAmenities,
  selectedRoomTypes,
  setSelectedRoomTypes,
  bedPreferences,
  setBedPreferences,
}) => {
  const toggle = (arr: string[], value: string, setter: (v: string[]) => void) =>
    arr.includes(value) ? setter(arr.filter((v) => v !== value)) : setter([...arr, value]);

  const handleReset = () => {
    setBudget(25000);
    setSelectedAmenities([]);
    setSelectedRoomTypes([]);
    setBedPreferences([]);
  };

  const amenities = ["Kitchenette", "TV", "Air Conditioner", "Mini Fridge", "WiFi", "Balcony", "Spa"];
  const roomTypes = ["Single", "Double", "Family Suite", "Suite"];
  const beds = ["Single Bed", "Double Bed", "Queen Size", "King Size"];

  return (
    <div className="w-full p-4 bg-white border border-[var(--color-secondary-light)] rounded-lg shadow-sm">
      <h2 className="font-bold mb-2 text-[var(--color-secondary)]">Filters</h2>

      <div className="mb-4">
        <p className="text-sm mb-1 text-[var(--color-secondary)]">Budget: NPR 1800 – {budget.toLocaleString()}</p>
        <input
          type="range"
          min={1800}
          max={25000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full cursor-pointer accent-[var(--color-primary)]"
        />
      </div>

      <div className="mb-4">
        <p className="font-semibold text-sm mb-2 text-[var(--color-secondary)]">Amenities</p>
        {amenities.map((a) => (
          <label key={a} className="flex items-center gap-2 text-sm mb-1 text-[var(--color-secondary)]">
            <input
              type="checkbox"
              checked={selectedAmenities.includes(a)}
              onChange={() => toggle(selectedAmenities, a, setSelectedAmenities)}
              className="accent-[var(--color-primary)]"
            />
            {a}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-semibold text-sm mb-2 text-[var(--color-secondary)]">Room Types</p>
        {roomTypes.map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm mb-1 text-[var(--color-secondary)]">
            <input
              type="checkbox"
              checked={selectedRoomTypes.includes(t)}
              onChange={() => toggle(selectedRoomTypes, t, setSelectedRoomTypes)}
              className="accent-[var(--color-primary)]"
            />
            {t}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-semibold text-sm mb-2 text-[var(--color-secondary)]">Bed Preference</p>
        {beds.map((b) => (
          <label key={b} className="flex items-center gap-2 text-sm mb-1 text-[var(--color-secondary)]">
            <input
              type="checkbox"
              checked={bedPreferences.includes(b)}
              onChange={() => toggle(bedPreferences, b, setBedPreferences)}
              className="accent-[var(--color-primary)]"
            />
            {b}
          </label>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="w-full bg-white text-[var(--color-secondary)] px-4 py-2 border border-[var(--color-secondary-light)] rounded-lg hover:bg-[var(--color-secondary-light)] transition cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default RoomFilter;
