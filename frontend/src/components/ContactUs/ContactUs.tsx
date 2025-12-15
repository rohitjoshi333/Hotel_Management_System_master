import { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { submitContactMessage } from "../../services/hotelApi";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          alt="Contact Us"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg text-center px-4">
            Get in Touch
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Contact Form */}
        <div className="flex flex-col gap-6">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
              <MapPin className="text-gray-700 mb-2" />
              <p className="text-center text-sm">123 LHotel XYZ, Kathmandu</p>
            </div>
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
              <Phone className="text-gray-700 mb-2" />
              <p className="text-center text-sm">+977 9800000000</p>
            </div>
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
              <Mail className="text-gray-700 mb-2" />
              <p className="text-center text-sm">info@hotelxyz.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Send Us a Message</h2>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:outline-none transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:outline-none transition"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:outline-none transition"
              />
              <textarea
                rows={4}
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:outline-none resize-none transition"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Support Info */}
            <div className="text-center mt-6 text-sm text-gray-500">
              <p>📞 Our support team replies within 24 hours.</p>
              <p className="mt-1">Available Mon–Fri, 9 AM – 6 PM</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition">
              <Instagram size={24} />
            </a>
          </div>
        </div>

        {/* Right: Info + Map */}
        <div className="flex flex-col gap-6">
          {/* FAQ Section */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Why Contact Us?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Fast response to your queries</li>
              <li>Personalized support for your booking</li>
              <li>24/7 assistance for emergencies</li>
            </ul>
          </div>

          {/* Embedded Map */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Find Us on Map</h2>
            <div className="w-full h-[250px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <iframe
                title="Hotel Location – Tribhuvan International Airport"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5857261638184!2d85.35409947626444!3d27.699196225849416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a266b342bc5%3A0x73bbfa829a89af1b!2sTribhuvan%20International%20Airport!5e0!3m2!1sen!2snp!4v1756478325413!5m2!1sen!2snp"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
