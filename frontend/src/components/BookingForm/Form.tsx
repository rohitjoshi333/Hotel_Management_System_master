import { useState, useEffect, useRef } from "react";
import type { Room } from "../../constants/types";

interface Props {
  room: Room;
  onSubmit: (bookingDetails: any) => void;
}

export default function Form({ room, onSubmit }: Props) {
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    streetAddress: "",
    streetAddress2: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
    arrivalDate: "",
    departureDate: "",
    paymentMethod: "",
    specialRequest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookingDetails = {
      ...formData,
      arrivalDateTime: `${formData.arrivalDate} ${room.checkIn}`,
      departureDateTime: `${formData.departureDate} ${room.checkOut}`,
      room: room.type,
      guests: selectedGuests,
    };
    onSubmit(bookingDetails);
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      streetAddress: "",
      streetAddress2: "",
      state: "",
      postalCode: "",
      phone: "",
      email: "",
      arrivalDate: "",
      departureDate: "",
      paymentMethod: "",
      specialRequest: "",
    });
    setSelectedGuests(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setGuestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Full Name */}
      <div>
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      {/* Address */}
      <div>
        <label className="form-label">Street Address</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div>
        <label className="form-label">Street Address Line 2</label>
        <input
          type="text"
          name="streetAddress2"
          value={formData.streetAddress2}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-grid-2">
        <div>
          <label className="form-label">State / Province</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Postal / ZIP Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      {/* Phone + Email */}
      <div>
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="+977 **********"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      {/* Arrival / Departure */}
      <div className="form-grid-2">
        <div>
          <label className="form-label">Arrival Date</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
            className="form-input"
          />
          <p className="form-helper">Check-in: {room.checkIn}</p>
        </div>
        <div>
          <label className="form-label">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
            className="form-input"
          />
          <p className="form-helper">Check-out: {room.checkOut}</p>
        </div>
      </div>

      {/* Guests Dropdown */}
      <div ref={dropdownRef} className="relative mb-4 text-[17px]">
        <label className="form-label">Guests:</label>
        <div
          className="dropdown"
          onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
        >
          <span className={selectedGuests ? "text-black" : "text-gray-400"}>
            {selectedGuests} {selectedGuests === 1 ? "Guest" : "Guests"}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform ${
              guestDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {guestDropdownOpen && (
          <ul className="dropdown-menu">
            {[...Array(room.guests).keys()].map((num) => {
              const guestNum = num + 1;
              return (
                <li
                  key={guestNum}
                  className={`dropdown-item ${
                    selectedGuests === guestNum ? "dropdown-item-selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedGuests(guestNum);
                    setGuestDropdownOpen(false);
                  }}
                >
                  {guestNum} {guestNum === 1 ? "Guest" : "Guests"}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <label className="form-label">Payment Method</label>
        <div className="radio-group">
          {["Credit Card", "Debit Card", "Cash", "Bank Transfer"].map(
            (method) => (
              <label key={method} className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  required
                />
                {method}
              </label>
            )
          )}
        </div>
      </div>

      {/* Special Request */}
      <div>
        <label className="form-label">Special Request (Optional)</label>
        <textarea
          name="specialRequest"
          value={formData.specialRequest}
          onChange={handleChange}
          className="form-input"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div>
        <div className="flex gap-3">
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
          >
            Clear Fields
          </button>
          <button type="submit" className="sub-btn">
            Confirm Booking
          </button>
        </div>
      </div>
    </form>
  );
}
