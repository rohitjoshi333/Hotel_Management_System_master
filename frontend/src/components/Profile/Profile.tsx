import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser, logoutUser } from "../../services/authUser";
import { fetchUserBookings, type UserBooking } from "../../services/hotelApi";

export default function Profile() {
  const [form, setForm] = useState<{ username: string; email: string; avatar?: string | null }>({
    username: "",
    email: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const [me, bookingsData] = await Promise.all([
          getCurrentUser(),
          token ? fetchUserBookings(token).catch(() => []) : Promise.resolve([]),
        ]);
        setForm({
          username: me?.username || "",
          email: me?.email || "",
          avatar: me?.avatar || null,
        });
        setBookings(bookingsData);
      } catch (err: any) {
        setError(err?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
        setBookingsLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await updateCurrentUser({ username: form.username, email: form.email, avatarFile });
      if (avatarFile) {
        setAvatarFile(null);
      }
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError(err?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 mt-[10%]">
        Loading profile...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Form Section */}
        <div className="w-full bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-2 text-[var(--color-primary)]">Your Profile</h1>
          <p className="text-[var(--color-secondary)] mb-4">Update your account information.</p>

          {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
          {success && <div className="text-green-600 mb-3 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-secondary-light)]/40">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-secondary)]">No photo</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-1">Profile picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full border border-[var(--color-secondary-light)] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-[var(--color-secondary-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[var(--color-secondary-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="sub-btn w-full disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                window.location.href = "/login";
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Booking History Section */}
        <div className="w-full bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-2 text-[var(--color-primary)]">Booking History</h2>
          <p className="text-[var(--color-secondary)] mb-4">View all your reservations.</p>

          {bookingsLoading ? (
            <div className="text-center py-8 text-gray-600">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No bookings found.</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-[var(--color-border)] rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Booking #{booking.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-[var(--color-secondary)]">
                        <p>
                          <span className="font-medium">Room:</span> {booking.room_detail?.number || "N/A"} - {booking.room_detail?.type || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Check-in:</span> {new Date(booking.check_in).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Check-out:</span> {new Date(booking.check_out).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Guests:</span> {booking.guests}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> NPR {booking.room_detail?.price?.toLocaleString() || "N/A"} / night
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(booking.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {booking.room_detail?.image && (
                      <div className="sm:w-32 w-full h-32 sm:h-auto">
                        <img
                          src={booking.room_detail.image}
                          alt={booking.room_detail.type || "Room"}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

