import { useEffect, useState } from "react";
import { FaConciergeBell, FaUtensils, FaSpa } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchTeamMembers, type TeamMember } from "../../services/hotelApi";

function AboutUs() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const members = await fetchTeamMembers();
        setTeam(members);
      } catch (err: any) {
        setTeamError(err?.message || "Unable to load team right now.");
      } finally {
        setLoadingTeam(false);
      }
    };
    loadTeam();
  }, []);

  return (
    <div>
      <div className="bg-white text-gray-800">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-100 via-white to-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between py-16 md:py-20 gap-8">
            
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black">
                Welcome to Luxuria Hotel
              </h1>

              <p className="text-gray-700 text-sm sm:text-base md:text-lg">
                Experience comfort, luxury, and exceptional hospitality at our premium hotel.
                We create memorable stays for every guest with world-class amenities and services.
              </p>

              <button
                className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg cursor-pointer text-sm sm:text-base"
                onClick={() => navigate("/allRooms")}
              >
                Explore Rooms
              </button>
            </div>

            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80"
                alt="Hotel Lobby"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-black mb-4">
              Our Premium Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-base">
              From wellness to fine dining, we provide exceptional services that make every stay unforgettable.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <FaConciergeBell />,
                title: "24/7 Concierge",
                desc: "Our concierge team is available round the clock to cater to all your needs."
              },
              {
                icon: <FaUtensils />,
                title: "Fine Dining",
                desc: "Savor exquisite cuisine prepared by our award-winning chefs."
              },
              {
                icon: <FaSpa />,
                title: "Spa & Wellness",
                desc: "Rejuvenate your mind and body at our luxurious spa and wellness center."
              }
            ].map((service, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md flex flex-col items-center text-center"
              >
                <div className="text-4xl text-black mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-gray-100 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-black mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-base">
              From humble beginnings to becoming a premier hospitality brand.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-6 sm:gap-8">
            {[
              { year: "2005", desc: "Founded with a vision to redefine luxury hospitality." },
              { year: "2012", desc: "Expanded to multiple locations with exceptional service standards." },
              { year: "2023", desc: "Recognized as a top-tier hospitality brand with award-winning services." }
            ].map((event, i) => (
              <div
                key={i}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center md:text-left"
              >
                <h3 className="font-bold text-black mb-2">{event.year}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{event.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-black mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-base">
              Our dedicated professionals ensure your stay is flawless and memorable.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {teamError && (
              <p className="text-red-600 text-center mb-4">{teamError}</p>
            )}
            {loadingTeam ? (
              <p className="text-center text-gray-600">Loading team...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                {team.length === 0 ? (
                  <p className="text-center text-gray-600 col-span-full">
                    Team information will be updated soon.
                  </p>
                ) : (
                  team.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-50 rounded-xl shadow-md overflow-hidden text-center"
                    >
                      <img
                        src={member.image_url || "https://via.placeholder.com/300x220"}
                        alt={member.name}
                        className="w-full h-48 sm:h-56 md:h-56 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-black mb-1 text-sm sm:text-base">{member.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-sm">{member.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutUs;
