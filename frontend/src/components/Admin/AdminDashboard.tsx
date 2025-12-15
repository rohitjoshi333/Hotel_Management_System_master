import { useEffect, useMemo, useState } from "react";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  fetchAdminBookings,
  updateBookingStatus,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  fetchContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../../services/hotelApi";
import type { Room } from "../../constants/types";
import type { GalleryImage, AdminBooking, ContactMessage } from "../../services/hotelApi";
import type { AuthenticatedUser } from "../../services/authUser";
import { logoutUser } from "../../services/authUser";
import { useNavigate } from "react-router-dom";

type RoomFormState = Partial<Room> & { coverImageFile?: File | null; galleryFiles?: File[] };

const emptyRoom: RoomFormState = {
  id: 0,
  number: "",
  type: "Single",
  price: 0,
  guests: 1,
  availability: true,
  bedPreference: "Queen Size",
  amenities: ["WiFi"],
  description: "",
  image: "",
  gallery: [],
  size: "",
  floor: 1,
  view: "",
  checkIn: "",
  checkOut: "",
  rating: 0,
  reviewsCount: 0,
  cancellationPolicy: "",
  roomService: "",
  breakfastIncluded: false,
  petsAllowed: false,
  smokingPolicy: "",
  parking: "",
  accessible: false,
  specialFeatures: [],
  coverImageFile: null,
  galleryFiles: [],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "gallery" | "bookings" | "users" | "team" | "messages">("overview");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomForm, setRoomForm] = useState<RoomFormState>(emptyRoom);
  const [isEditing, setIsEditing] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [users, setUsers] = useState<AuthenticatedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userForm, setUserForm] = useState<{ id?: number; username: string; email: string; password?: string; is_staff?: boolean }>({
    username: "",
    email: "",
    password: "",
    is_staff: false,
  });
  const [savingUser, setSavingUser] = useState(false);

  const [team, setTeam] = useState<{ id?: number; name: string; role: string; image_url?: string; order?: number }[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamForm, setTeamForm] = useState<{ id?: number; name: string; role: string; image_url?: string; order?: number }>({
    name: "",
    role: "",
    image_url: "",
    order: team.length + 1,
  });
  const [savingTeam, setSavingTeam] = useState(false);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingRooms(true);
      setGalleryLoading(true);
      setGalleryError("");
      setBookingsLoading(true);
      setUsersLoading(true);
      setTeamLoading(true);
      setMessagesLoading(true);
      try {
        const [roomData, galleryData, bookingData, userData, teamData, messagesData] = await Promise.all([
          fetchRooms(),
          fetchGalleryImages(),
          fetchAdminBookings(token),
          fetchUsers(token),
          fetchTeam(),
          fetchContactMessages(token),
        ]);
        setRooms(roomData);
        setGallery(galleryData);
        setBookings(bookingData);
        setUsers(userData);
        setTeam(teamData);
        setMessages(messagesData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard data.";
        setGalleryError(message);
      } finally {
        setLoadingRooms(false);
        setGalleryLoading(false);
        setBookingsLoading(false);
        setUsersLoading(false);
        setTeamLoading(false);
        setMessagesLoading(false);
      }
    };

    load();
  }, [token]);

  const handleSaveRoom = async () => {
    if (!roomForm.number || !roomForm.type) return;
    setSavingRoom(true);
    try {
      if (isEditing && roomForm.id) {
        await updateRoom(roomForm.id, roomForm, token);
      } else {
        await createRoom(roomForm, token);
      }
      const refreshed = await fetchRooms();
      setRooms(refreshed);
      setRoomForm(emptyRoom);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to save room.");
    } finally {
      setSavingRoom(false);
    }
  };

  const handleEdit = (room: Room) => {
    setRoomForm({ ...room, coverImageFile: null, galleryFiles: [] });
    setIsEditing(true);
    setActiveTab("rooms");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Delete this room?")) return;
    try {
      await deleteRoom(id, token);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to delete room.");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File | null;
    if (!file) {
      alert("Please choose an image.");
      return;
    }
    setUploading(true);
    try {
      await uploadGalleryImage(file, formData.get("title") as string, formData.get("is_featured") === "on", token);
      const refreshed = await fetchGalleryImages();
      setGallery(refreshed);
      e.currentTarget.reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateGallery = async (id: number, title: string, is_featured: boolean) => {
    try {
      await updateGalleryImage(id, { title, is_featured }, token);
      const refreshed = await fetchGalleryImages();
      setGallery(refreshed);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id, token);
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status, token);
      const refreshed = await fetchAdminBookings(token);
      setBookings(refreshed);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booking.");
    }
  };

  const handleSaveUser = async () => {
    if (!userForm.username || !userForm.email) return;
    setSavingUser(true);
    try {
      if (userForm.id) {
        await updateUser(userForm.id, { username: userForm.username, email: userForm.email, is_staff: userForm.is_staff }, token);
      } else {
        await createUser(
          { username: userForm.username, email: userForm.email, password: userForm.password || "TempPass123!", is_staff: userForm.is_staff },
          token
        );
      }
      const refreshed = await fetchUsers(token);
      setUsers(refreshed);
      setUserForm({ username: "", email: "", password: "", is_staff: false });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save user.");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name || !teamForm.role) return;
    setSavingTeam(true);
    try {
      if (teamForm.id) {
        await updateTeamMember(teamForm.id, teamForm, token);
      } else {
        await createTeamMember(teamForm, token);
      }
      const refreshed = await fetchTeam();
      setTeam(refreshed);
      setTeamForm({ name: "", role: "", image_url: "", order: team.length + 1 });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save team member.");
    } finally {
      setSavingTeam(false);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await deleteTeamMember(id, token);
      setTeam((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete team member.");
    }
  };

  const roomCount = rooms.length;
  const featuredImages = useMemo(() => gallery.filter((g) => g.is_featured).length, [gallery]);
  const bookingCount = bookings.length;
  const userCount = users.length;
  const unreadMessagesCount = useMemo(() => messages.filter((m) => !m.is_read).length, [messages]);

  const bookingsByRoom = useMemo(() => {
    const map: Record<number, AdminBooking[]> = {};
    bookings.forEach((b) => {
      map[b.room] = map[b.room] ? [...map[b.room], b] : [b];
    });
    return map;
  }, [bookings]);

  return (
    <div className="pt-24 pb-16 bg-[var(--color-accent)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Admin</p>
            <h1 className="text-3xl font-bold text-[var(--color-secondary)]">Control Panel</h1>
            <p className="text-gray-600">Manage rooms and gallery assets.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition self-start sm:self-auto"
          >
            Sign out
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { key: "overview", label: "Overview" },
            { key: "messages", label: `Messages${unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : ""}` },
            { key: "rooms", label: "Rooms" },
            { key: "bookings", label: "Bookings" },
            { key: "gallery", label: "Gallery" },
            { key: "users", label: "Users" },
            { key: "team", label: "Team Members" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab.key ? "bg-black text-white shadow-md" : "bg-white text-[var(--color-secondary)] border border-[var(--color-border)] hover:border-black/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
              <p className="text-sm text-gray-500">Rooms</p>
              <p className="text-2xl font-semibold">{roomCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
              <p className="text-sm text-gray-500">Gallery items</p>
              <p className="text-2xl font-semibold">{gallery.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
              <p className="text-sm text-gray-500">Featured images</p>
              <p className="text-2xl font-semibold">{featuredImages}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-2xl font-semibold">{bookingCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
              <p className="text-sm text-gray-500">Users</p>
              <p className="text-2xl font-semibold">{userCount}</p>
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{isEditing ? "Edit room" : "Add room"}</h2>
                {isEditing && (
                  <button
                    className="text-sm text-gray-500 underline"
                    onClick={() => {
                      setIsEditing(false);
                      setRoomForm(emptyRoom);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <input
                  className="form-input"
                  placeholder="Number"
                  value={roomForm.number || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, number: e.target.value }))}
                />
                <select
                  className="form-input"
                  value={roomForm.type || "Single"}
                  onChange={(e) => setRoomForm((p) => ({ ...p, type: e.target.value as Room["type"] }))}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Family Suite">Family Suite</option>
                </select>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Price per night"
                  value={roomForm.price ?? 0}
                  onChange={(e) => setRoomForm((p) => ({ ...p, price: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Capacity"
                  value={roomForm.guests ?? 1}
                  onChange={(e) => setRoomForm((p) => ({ ...p, guests: Number(e.target.value) }))}
                />
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">Cover image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => setRoomForm((p) => ({ ...p, coverImageFile: e.target.files?.[0] || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">Gallery images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-input"
                    onChange={(e) => setRoomForm((p) => ({ ...p, galleryFiles: e.target.files ? Array.from(e.target.files) : [] }))}
                  />
                </div>
                <select
                  className="form-input"
                  value={roomForm.bedPreference || "Queen Size"}
                  onChange={(e) => setRoomForm((p) => ({ ...p, bedPreference: e.target.value as Room["bedPreference"] }))}
                >
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Queen Size">Queen Size</option>
                  <option value="King Size">King Size</option>
                </select>
                <input
                  className="form-input"
                  placeholder="Amenities (comma separated)"
                  value={(roomForm.amenities || []).join(", ")}
                  onChange={(e) =>
                    setRoomForm((p) => ({
                      ...p,
                      amenities: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                />
                <input
                  className="form-input"
                  placeholder="Special features (comma separated)"
                  value={(roomForm.specialFeatures || []).join(", ")}
                  onChange={(e) =>
                    setRoomForm((p) => ({
                      ...p,
                      specialFeatures: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                />
                <input
                  className="form-input"
                  placeholder="Room size (e.g., 28 sqm)"
                  value={roomForm.size || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, size: e.target.value }))}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Floor"
                  value={roomForm.floor ?? 1}
                  onChange={(e) => setRoomForm((p) => ({ ...p, floor: Number(e.target.value) }))}
                />
                <input
                  className="form-input"
                  placeholder="View (e.g., City View)"
                  value={roomForm.view || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, view: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="form-input"
                    placeholder="Check-in (e.g., 2:00 PM)"
                    value={roomForm.checkIn || ""}
                    onChange={(e) => setRoomForm((p) => ({ ...p, checkIn: e.target.value }))}
                  />
                  <input
                    className="form-input"
                    placeholder="Check-out (e.g., 11:00 AM)"
                    value={roomForm.checkOut || ""}
                    onChange={(e) => setRoomForm((p) => ({ ...p, checkOut: e.target.value }))}
                  />
                </div>
                <input
                  className="form-input"
                  placeholder="Parking"
                  value={roomForm.parking || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, parking: e.target.value }))}
                />
                <input
                  className="form-input"
                  placeholder="Smoking policy"
                  value={roomForm.smokingPolicy || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, smokingPolicy: e.target.value }))}
                />
                <input
                  className="form-input"
                  placeholder="Room service"
                  value={roomForm.roomService || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, roomService: e.target.value }))}
                />
                <textarea
                  className="form-input"
                  placeholder="Cancellation policy"
                  value={roomForm.cancellationPolicy || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, cancellationPolicy: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={roomForm.breakfastIncluded ?? false}
                      onChange={(e) => setRoomForm((p) => ({ ...p, breakfastIncluded: e.target.checked }))}
                    />
                    Breakfast included
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={roomForm.petsAllowed ?? false}
                      onChange={(e) => setRoomForm((p) => ({ ...p, petsAllowed: e.target.checked }))}
                    />
                    Pets allowed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={roomForm.accessible ?? false}
                      onChange={(e) => setRoomForm((p) => ({ ...p, accessible: e.target.checked }))}
                    />
                    Accessible
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={roomForm.availability ?? true}
                      onChange={(e) => setRoomForm((p) => ({ ...p, availability: e.target.checked }))}
                    />
                    Available
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="Rating"
                    value={roomForm.rating ?? 4.5}
                    onChange={(e) => setRoomForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Reviews count"
                    value={roomForm.reviewsCount ?? 0}
                    onChange={(e) => setRoomForm((p) => ({ ...p, reviewsCount: Number(e.target.value) }))}
                  />
                </div>
                <textarea
                  className="form-input"
                  placeholder="Description"
                  value={roomForm.description || ""}
                  onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))}
                />
                <button
                  className="sub-btn"
                  onClick={handleSaveRoom}
                  disabled={savingRoom}
                >
                  {savingRoom ? "Saving..." : isEditing ? "Update room" : "Create room"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {loadingRooms ? (
                <p className="text-gray-600">Loading rooms...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => {
                    const imgSrc = room.image || room.gallery?.[0] || "https://via.placeholder.com/140x100?text=Room";
                    return (
                      <div key={room.id} className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
                        <div className="flex gap-3">
                          <img
                            src={imgSrc}
                            alt={room.type}
                            className="h-24 w-32 object-cover rounded-xl border border-[var(--color-border)]"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm text-gray-500">{room.number}</p>
                                <p className="text-lg font-semibold">{room.type}</p>
                              </div>
                              <span className="text-sm font-semibold">NPR {room.price}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{room.description}</p>
                            {bookingsByRoom[room.id]?.length ? (
                              <p className="text-xs text-gray-500 mt-1">{bookingsByRoom[room.id].length} bookings</p>
                            ) : (
                              <p className="text-xs text-gray-400 mt-1">No bookings yet</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            className="px-3 py-1 rounded-full text-sm bg-black text-white"
                            onClick={() => handleEdit(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 rounded-full text-sm border border-red-200 text-red-600"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            Delete
                          </button>
                        </div>
                        {bookingsByRoom[room.id]?.length ? (
                          <div className="mt-3 space-y-1">
                            {bookingsByRoom[room.id].slice(0, 3).map((b) => (
                              <div key={b.id} className="text-xs text-gray-600 flex items-center justify-between">
                                <span>#{b.id} • {b.user.username}</span>
                                <span className="uppercase text-[10px] px-2 py-1 rounded-full bg-gray-100">{b.status}</span>
                              </div>
                            ))}
                            {bookingsByRoom[room.id].length > 3 && (
                              <p className="text-[10px] text-gray-500">+{bookingsByRoom[room.id].length - 3} more</p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleUpload} className="lg:col-span-1 p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-3">
              <h2 className="text-lg font-semibold">Upload image</h2>
              <input name="title" className="form-input" placeholder="Title" />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="is_featured" />
                Featured
              </label>
              <input name="image" type="file" accept="image/*" className="form-input" />
              <button className="sub-btn" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {galleryLoading ? (
                <p className="text-gray-600">Loading gallery...</p>
              ) : galleryError ? (
                <p className="text-red-600">{galleryError}</p>
              ) : gallery.length === 0 ? (
                <p className="text-gray-600">No images yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((img) => (
                    <div key={img.id} className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
                      <img src={img.image} alt={img.title || "Gallery"} className="h-48 w-full object-cover" />
                      <div className="p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            className="form-input text-sm"
                            value={img.title || ""}
                            onChange={(e) => handleUpdateGallery(img.id, e.target.value, img.is_featured)}
                            placeholder="Title"
                          />
                          <label className="flex items-center gap-1 text-[10px] text-gray-700">
                            <input
                              type="checkbox"
                              checked={img.is_featured}
                              onChange={(e) => handleUpdateGallery(img.id, img.title || "", e.target.checked)}
                            />
                            Featured
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-gray-500">{new Date(img.created_at).toLocaleDateString()}</p>
                          <button
                            className="text-sm text-red-600 underline"
                            onClick={() => handleDeleteImage(img.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookingsLoading ? (
              <p className="text-gray-600">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Booking #{b.id}</p>
                        <p className="text-lg font-semibold">{b.user.username}</p>
                      </div>
                      <select
                        className="form-input w-32"
                        value={b.status}
                        onChange={(e) => handleBookingStatus(b.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-600">Room: {b.room_detail?.number || b.room_detail?.type}</p>
                    <p className="text-sm text-gray-600">Guests: {b.guests}</p>
                    <p className="text-sm text-gray-600">Check-in: {b.check_in}</p>
                    <p className="text-sm text-gray-600">Check-out: {b.check_out}</p>
                    <p className="text-[11px] text-gray-400">Created: {new Date(b.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-3">
              <h2 className="text-lg font-semibold">{userForm.id ? "Edit user" : "Create user"}</h2>
              <input
                className="form-input"
                placeholder="Username"
                value={userForm.username}
                onChange={(e) => setUserForm((p) => ({ ...p, username: e.target.value }))}
              />
              <input
                className="form-input"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
              />
              {!userForm.id && (
                <input
                  className="form-input"
                  placeholder="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                />
              )}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={userForm.is_staff}
                  onChange={(e) => setUserForm((p) => ({ ...p, is_staff: e.target.checked }))}
                />
                Admin
              </label>
              <div className="flex items-center gap-2">
                <button className="sub-btn" onClick={handleSaveUser} disabled={savingUser}>
                  {savingUser ? "Saving..." : userForm.id ? "Update user" : "Create user"}
                </button>
                {userForm.id && (
                  <button
                    className="text-sm text-gray-500 underline"
                    onClick={() => setUserForm({ username: "", email: "", password: "", is_staff: false })}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {usersLoading ? (
                <p className="text-gray-600">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-secondary-light)]/50">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.username} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-[var(--color-secondary)]">
                              {u.username?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">ID {u.id}</p>
                          <p className="text-lg font-semibold">{u.username}</p>
                          <p className="text-sm text-gray-600">{u.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{u.is_staff ? "Admin" : "User"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          className="px-3 py-1 rounded-full text-sm bg-black text-white"
                          onClick={() => setUserForm({ id: u.id, username: u.username, email: u.email, is_staff: u.is_staff })}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded-full text-sm border border-red-200 text-red-600"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm space-y-3">
              <h2 className="text-lg font-semibold">{teamForm.id ? "Edit team member" : "Add team member"}</h2>
              <input
                className="form-input"
                placeholder="Name"
                value={teamForm.name}
                onChange={(e) => setTeamForm((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="form-input"
                placeholder="Role"
                value={teamForm.role}
                onChange={(e) => setTeamForm((p) => ({ ...p, role: e.target.value }))}
              />
              <input
                className="form-input"
                placeholder="Image URL"
                value={teamForm.image_url || ""}
                onChange={(e) => setTeamForm((p) => ({ ...p, image_url: e.target.value }))}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Order"
                value={teamForm.order ?? team.length + 1}
                onChange={(e) => setTeamForm((p) => ({ ...p, order: Number(e.target.value) }))}
              />
              <div className="flex items-center gap-2">
                <button className="sub-btn" onClick={handleSaveTeam} disabled={savingTeam}>
                  {savingTeam ? "Saving..." : teamForm.id ? "Update member" : "Add member"}
                </button>
                {teamForm.id && (
                  <button
                    className="text-sm text-gray-500 underline"
                    onClick={() => setTeamForm({ name: "", role: "", image_url: "", order: team.length + 1 })}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {teamLoading ? (
                <p className="text-gray-600">Loading team...</p>
              ) : team.length === 0 ? (
                <p className="text-gray-600">No team members yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Order {member.order}</p>
                          <p className="text-lg font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                          {member.image_url && <img src={member.image_url} alt={member.name} className="h-12 w-12 object-cover rounded-full" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          className="px-3 py-1 rounded-full text-sm bg-black text-white"
                          onClick={() => setTeamForm(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded-full text-sm border border-red-200 text-red-600"
                          onClick={() => handleDeleteTeam(member.id!)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            {messagesLoading ? (
              <p className="text-gray-600">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-600">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl bg-white border shadow-sm space-y-3 ${
                      !msg.is_read ? "border-blue-300 bg-blue-50/30" : "border-[var(--color-border)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{msg.subject}</h3>
                          {!msg.is_read && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              New
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-[var(--color-secondary)]">
                          <p>
                            <span className="font-medium">From:</span> {msg.name} ({msg.email})
                          </p>
                          <p>
                            <span className="font-medium">Date:</span> {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!msg.is_read && (
                          <button
                            className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                            onClick={async () => {
                              try {
                                await markMessageAsRead(msg.id, token);
                                setMessages((prev) =>
                                  prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
                                );
                              } catch (err) {
                                alert(err instanceof Error ? err.message : "Failed to mark as read.");
                              }
                            }}
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          className="px-3 py-1 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50 transition"
                          onClick={async () => {
                            if (!confirm("Delete this message?")) return;
                            try {
                              await deleteContactMessage(msg.id, token);
                              setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                            } catch (err) {
                              alert(err instanceof Error ? err.message : "Failed to delete message.");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

