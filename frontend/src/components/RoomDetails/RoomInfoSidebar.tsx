import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers, FaBuilding, FaBed, FaStar,
    FaInfo
} from "react-icons/fa";
import type { Room } from "../../constants/types";

interface Props {
    room: Room;
}

export default function RoomInfoSidebar({ room }: Props) {
    const navigate = useNavigate();
    const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState(1);

    return (
        <div className="lg:max-w-[33%] border border-[var(--color-secondary-light)] rounded-2xl p-4 ">
            <h1 className="text-2xl font-bold mb-2 ">{room.type} Room</h1>

            <div className="flex gap-4">
                <div className="text-[var(--color-secondary)] flex items-center gap-2 mb-4">
                    <div className="text-[15px]"><FaUsers /></div>
                    <div className="text-[12px]">Up to {room.guests} Guests</div>
                </div>

                <div className="text-[var(--color-secondary)] flex items-center gap-2 mb-4">
                    <div className="text-[15px]"><FaBuilding /></div>
                    <div className="text-[12px]"> Floor {room.floor}</div>
                </div>

                <div className="text-[var(--color-secondary)] flex items-center gap-2 mb-4">
                    <div className="text-[15px]"><FaBed /></div>
                    <div className="text-[12px]"> {room.bedPreference} Bed</div>
                </div>
            </div>

            {/* Rating */}
            <div>
                <div className="text-[var(--color-secondary)] flex items-center gap-2 mb-4">
                    <div className="text-[19px] text-yellow-300"><FaStar /></div>
                    <div className="text-[17px] font-bold"> {room.rating}</div>
                    <div className="text-[var(--color-secondary)]">
                        ({room.reviewsCount} reviews)
                    </div>
                </div>
            </div>

            <hr className="text-[var(--color-secondary-light)]" />

            {/* Price */}
            <div>
                <h1 className="text-[17px] font-[700]">Rs. {room.price}</h1>
                <p className="text-[var(--color-secondary)] text-sm mb-4">per night</p>
            </div>

            {/* Dates */}
            <div className="flex gap-4 mb-3">
                {/* Check-in */}
                <div className="flex flex-col w-[140px]">
                    <label htmlFor="in" className="text-[var(--color-secondary)] mb-1">
                        Check-in Date:
                    </label>
                    <input type="date" id="in" className="p-2 rounded bg-[var(--color-bg-light)]" />
                </div>

                {/* Check-out */}
                <div className="flex flex-col w-[140px]">
                    <label htmlFor="out" className="text-[var(--color-secondary)] mb-1">
                        Check-out Date:
                    </label>
                    <input type="date" id="out" className="p-2 rounded bg-[var(--color-bg-light)]" />
                </div>
            </div>

            {/* Guests Dropdown */}
            <div className="relative mb-4 text-[17px]">
                <label className="text-[var(--color-secondary)] mb-1">Guests:</label>
                <div
                    className="w-full p-2 rounded bg-gray-50/70 border border-[var(--color-secondary-light)] cursor-pointer flex justify-between items-center"
                    onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                >
                    <span>
                        {selectedGuests} {selectedGuests === 1 ? "Guest" : "Guests"}
                    </span>
                </div>

                {guestDropdownOpen && (
                    <ul className="absolute w-full bg-white rounded mt-1 max-h-50 overflow-auto shadow-lg z-50">
                        {[...Array(room.guests).keys()].map((num) => {
                            const guestNum = num + 1;
                            return (
                                <li
                                    key={guestNum}
                                    className={`p-2 hover:bg-[var(--color-secondary-light)] text-[var(--color-text-dark-bg)] cursor-pointer ${guestNum === selectedGuests ? "font-semibold bg-gray-200" : ""
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

            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <div><FaInfo /></div>
                    <div className="text-[17px] font-[700]">What You need to Know</div>
                </div>
                <div className="text-[var(--color-secondary)] text-s flex justify-between">
                    <div>Check In Time:</div>
                    <div>{room.checkIn}</div>
                </div>
                <div className="text-[var(--color-secondary)] text-s flex justify-between">
                    <div>Check Out Time:</div>
                    <div>{room.checkOut}</div>
                </div>
                <div className="text-[var(--color-secondary)] text-s">
                    <div>Cancellation Policy:</div>
                    <div className="pl-40 text-right mt-[-24px]">{room.cancellationPolicy}</div>
                </div>
            </div>

            <div>
                <button
                    className="bg-[var(--color-primary)] w-full text-white p-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
                    onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) {
                            navigate(`/booking/${room.id}`);
                        } else {
                            navigate("/signup");
                        }
                    }}
                >
                    Book Now
                </button>
            </div>

        </div>
    );
}
