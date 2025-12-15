import { FaBriefcase, FaUtensils } from "react-icons/fa";
import { GiSteam } from "react-icons/gi";

function HotelServices() {
  return (
    <div className="bg-[var(--color-secondary-light)] p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Premium Services</h1>
        <p className="text-[var(--color-secondary)] mt-2">
          Exceptional amenities and services to make your stay unforgettable
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-[350px] bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center text-black cursor-pointer">
          <GiSteam className="text-2xl mx-auto mb-4 text-[var(--color-primary)]" />
          <h3 className="text-xl font-semibold">Spa & Wellness</h3>
          <p className="text-[var(--color-secondary)] pt-7">
            Relax and rejuvenate at our world-class spa facility
          </p>
        </div>

        <div className="w-[350px] bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center text-black cursor-pointer">
          <FaUtensils className="text-2xl mx-auto mb-4 text-[var(--color-primary)]" />
          <h3 className="text-xl font-semibold">Fine Dining</h3>
          <p className="text-[var(--color-secondary)] pt-7">
            Experience culinary excellence at our award-winning restaurant
          </p>
        </div>

        <div className="w-[350px] bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center text-black cursor-pointer">
          <FaBriefcase className="text-2xl mx-auto mb-4 text-[var(--color-primary)]" />
          <h3 className="text-xl font-semibold">Business Center</h3>
          <p className="text-[var(--color-secondary)] pt-7">
            Modern facilities for meetings and business needs
          </p>
        </div>
      </div>
    </div>
  );
}

export default HotelServices;
