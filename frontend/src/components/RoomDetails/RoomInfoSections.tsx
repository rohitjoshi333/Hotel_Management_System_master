import { FaMountainCity } from "react-icons/fa6";
import type { Room } from "../../constants/types";
import {
    FaClipboardList, FaConciergeBell,
    FaDog, FaBreadSlice, FaHotel, FaGem, FaSwimmingPool
} from "react-icons/fa";

interface Props {
    room: Room;
}

export default function RoomInfoSections({ room }: Props) {
    return (
        <>
            {/* Room Information Section */}
            <div className="flex flex-col lg:flex-row justify-center max-w-7xl mx-auto gap-2 text-left">


                <div className="lg:w-max-[53%] w-full border border-[var(--color-secondary-light)] rounded-2xl p-4">
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <div><FaClipboardList /></div>
                            <div className="text-[17px] font-[700]">Room Description</div>
                        </div>
                        <div className="text-[var(--color-secondary)] text-s text-justify">{room.description}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <div><FaConciergeBell /></div>
                            <div className="text-[17px] font-[700]">Room Service</div>
                        </div>
                        <div className="text-[var(--color-secondary)] text-s">{room.roomService}</div>
                    </div>
                </div>


                <div className="lg:w-max-[53%] w-full flex justify-between border border-[var(--color-secondary-light)] rounded-2xl p-4 g-4">

                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <div><FaMountainCity /></div>
                                <div className="text-[17px] font-[700]">View</div>
                            </div>
                            <div className="text-[var(--color-secondary)] text-s">
                                <span>{room.view}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <div><FaDog /></div>
                                <div className="text-[17px] font-[700]">Pets</div>
                            </div>
                            <div className="text-[var(--color-secondary)] text-s">
                                {room.petsAllowed ? ("Allowed") : ("Not Allowed")}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <div><FaBreadSlice /></div>
                                <div className="text-[17px] font-[700]">Breakfast</div>
                            </div>
                            <div className="text-[var(--color-secondary)] text-s">
                                {room.breakfastIncluded ? ("Included") : ("Not Included")}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <div><FaHotel /></div>
                            <div className="text-[17px] font-[700]">Amenities</div>
                        </div>
                        {room.amenities.map((amenity, idx) => (
                            <span
                                key={idx}
                                className="text-[var(--color-secondary)] text-s"
                            >
                                <ul className="list-disc ml-6">
                                    <li>{amenity}</li>
                                </ul>
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <div><FaGem /></div>
                                <div className="text-[17px] font-[700]">Features</div>
                            </div>
                            {room.specialFeatures.map((Feature, id) => (
                                <span
                                    key={id}
                                    className="text-[var(--color-secondary)] text-s "
                                >
                                    <ul className="list-disc ml-6">
                                        <li>{Feature}</li>
                                    </ul>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="lg:max-w-[53%] w-full flex flex-col border border-[var(--color-secondary-light)] rounded-2xl p-4 gap-4">
                    <div className="w-full">
                        <h1 className="text-[17px] font-[700]">Room Details</h1>
                        <div className="text-[var(--color-secondary)] text-s flex justify-between">
                            <div>Parking Facility:</div>
                            <div>{room.parking}</div>
                        </div>
                        <div className="text-[var(--color-secondary)] text-s flex justify-between">
                            <div>Room size:</div>
                            <div>{room.size}</div>
                        </div>
                        <div className="text-[var(--color-secondary)] text-s flex justify-between">
                            <div>Smoking Policy:</div>
                            <div>{room.smokingPolicy}</div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div><FaSwimmingPool /></div>
                            <div className="text-[17px] font-[700]">Pool Access</div>
                        </div>

                        <div>
                            <div className="text-[var(--color-secondary)] text-s">
                                {room.accessible ? ("Allowed") : ("Not Allowed")}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}
