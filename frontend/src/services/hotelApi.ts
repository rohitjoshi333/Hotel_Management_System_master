import type { Room } from "../constants/types";
import { apiFetch, buildHeaders, API_BASE_URL, handleResponse } from "./authUser";
import type { AuthenticatedUser } from "./authUser";
type ApiRoom = {
  id: number;
  number: string;
  room_type: string;
  price_per_night: string | number;
  capacity: number;
  is_available: boolean;
  description?: string;
  bed_preference?: string;
  amenities?: string[] | string;
  size?: string;
  floor?: number;
  view?: string;
  check_in?: string;
  check_out?: string;
  rating?: number | string;
  reviews_count?: number;
  cancellation_policy?: string;
  room_service?: string;
  breakfast_included?: boolean;
  pets_allowed?: boolean;
  smoking_policy?: string;
  parking?: string;
  accessible?: boolean;
  special_features?: string[] | string;
  image?: string;
  gallery?: string[];
};

const roomTypeMap: Record<string, Room["type"]> = {
  single: "Single",
  double: "Double",
  suite: "Suite",
  family_suite: "Family Suite",
};

const mapRoomType = (roomType: string): Room["type"] => {
  return roomTypeMap[roomType] ?? "Single";
};

const DEFAULT_ROOM_IMAGE = `${API_BASE_URL}/media/gallery/IMG_2423.jpeg`;

const parseList = (value?: string[] | string): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? [value] : [];
  }
};

const mapRoom = (apiRoom: ApiRoom): Room => {
  const mappedType = mapRoomType(apiRoom.room_type);
  const fallbackImage = apiRoom.image || apiRoom.gallery?.[0] || DEFAULT_ROOM_IMAGE;
  const gallery = apiRoom.gallery && apiRoom.gallery.length ? apiRoom.gallery : [fallbackImage];

  return {
    id: apiRoom.id,
    number: apiRoom.number,
    availability: apiRoom.is_available,
    guests: apiRoom.capacity,
    amenities: parseList(apiRoom.amenities).length ? parseList(apiRoom.amenities) : ["WiFi"],
    type: mappedType,
    bedPreference: (apiRoom.bed_preference as Room["bedPreference"]) || "Queen Size",
    description: apiRoom.description || "Room details coming soon.",
    price: Number(apiRoom.price_per_night) || 0,
    image: fallbackImage,
    gallery,
    size: apiRoom.size || "28 sqm",
    floor: apiRoom.floor || 1,
    view: apiRoom.view || "City View",
    checkIn: apiRoom.check_in || "2:00 PM",
    checkOut: apiRoom.check_out || "11:00 AM",
    rating: Number(apiRoom.rating || 4.5),
    reviewsCount: apiRoom.reviews_count ?? 0,
    cancellationPolicy: apiRoom.cancellation_policy || "Free cancellation available.",
    roomService: apiRoom.room_service || "Available 24/7",
    breakfastIncluded: Boolean(apiRoom.breakfast_included),
    petsAllowed: Boolean(apiRoom.pets_allowed),
    smokingPolicy: apiRoom.smoking_policy || "Non-smoking",
    parking: apiRoom.parking || "On-site parking",
    accessible: apiRoom.accessible ?? true,
    specialFeatures: parseList(apiRoom.special_features),
  };
};

export const fetchRooms = async (): Promise<Room[]> => {
  const apiRooms = await apiFetch("/rooms/");
  if (!Array.isArray(apiRooms)) return [];
  return apiRooms.map((room: ApiRoom) => mapRoom(room));
};

export const fetchRoomById = async (id: number): Promise<Room | null> => {
  try {
    const apiRoom = await apiFetch(`/rooms/${id}/`);
    return mapRoom(apiRoom as ApiRoom);
  } catch {
    return null;
  }
};

type BookingPayload = {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export const createBooking = async (payload: BookingPayload, token: string) => {
  if (!token) {
    throw new Error("You need to log in first.");
  }

  return apiFetch("/bookings/", {
    method: "POST",
    headers: buildHeaders({
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify({
      room: payload.roomId,
      check_in: payload.checkIn,
      check_out: payload.checkOut,
      guests: payload.guests,
    }),
  });
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image_url: string;
  order: number;
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const data = await apiFetch("/team/");
  if (!Array.isArray(data)) return [];
  return data as TeamMember[];
};

export type GalleryImage = {
  id: number;
  title: string;
  image: string;
  is_featured: boolean;
  created_at: string;
};

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  const data = await apiFetch("/gallery/");
  if (!Array.isArray(data)) return [];
  return data as GalleryImage[];
};

export const createRoom = async (payload: Partial<Room>, token: string) => {
  if (!token) throw new Error("Login required.");
  const form = new FormData();
  if (payload.number) form.append("number", payload.number);
  if (payload.type) form.append("room_type", payload.type.toLowerCase().replace(" ", "_"));
  if (payload.price !== undefined) form.append("price_per_night", String(payload.price));
  if (payload.guests !== undefined) form.append("capacity", String(payload.guests));
  form.append("is_available", String(payload.availability ?? true));

  if (payload.description) form.append("description", payload.description);
  if (payload.bedPreference) form.append("bed_preference", payload.bedPreference);
  if (payload.amenities) form.append("amenities", JSON.stringify(payload.amenities));
  if (payload.size) form.append("size", payload.size);
  if (payload.floor !== undefined) form.append("floor", String(payload.floor));
  if (payload.view) form.append("view", payload.view);
  if (payload.checkIn) form.append("check_in", payload.checkIn);
  if (payload.checkOut) form.append("check_out", payload.checkOut);
  if (payload.rating !== undefined) form.append("rating", String(payload.rating));
  if (payload.reviewsCount !== undefined) form.append("reviews_count", String(payload.reviewsCount));
  if (payload.cancellationPolicy) form.append("cancellation_policy", payload.cancellationPolicy);
  if (payload.roomService) form.append("room_service", payload.roomService);
  form.append("breakfast_included", String(payload.breakfastIncluded ?? false));
  form.append("pets_allowed", String(payload.petsAllowed ?? false));
  if (payload.smokingPolicy) form.append("smoking_policy", payload.smokingPolicy);
  if (payload.parking) form.append("parking", payload.parking);
  form.append("accessible", String(payload.accessible ?? true));
  if (payload.specialFeatures) form.append("special_features", JSON.stringify(payload.specialFeatures));

  const coverImageFile = (payload as any).coverImageFile;
  if (coverImageFile) form.append("cover_image", coverImageFile);

  const galleryFiles = (payload as any).galleryFiles;
  if (galleryFiles && Array.isArray(galleryFiles)) {
    galleryFiles.forEach((file: File) => {
      form.append("gallery_images", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/admin/rooms/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return handleResponse(response);
};

export const updateRoom = async (id: number, payload: Partial<Room>, token: string) => {
  if (!token) throw new Error("Login required.");
  const form = new FormData();
  if (payload.number) form.append("number", payload.number);
  if (payload.type) form.append("room_type", payload.type.toLowerCase().replace(" ", "_"));
  if (payload.price !== undefined) form.append("price_per_night", String(payload.price));
  if (payload.guests !== undefined) form.append("capacity", String(payload.guests));
  form.append("is_available", String(payload.availability ?? true));

  if (payload.description) form.append("description", payload.description);
  if (payload.bedPreference) form.append("bed_preference", payload.bedPreference);
  if (payload.amenities) form.append("amenities", JSON.stringify(payload.amenities));
  if (payload.size) form.append("size", payload.size);
  if (payload.floor !== undefined) form.append("floor", String(payload.floor));
  if (payload.view) form.append("view", payload.view);
  if (payload.checkIn) form.append("check_in", payload.checkIn);
  if (payload.checkOut) form.append("check_out", payload.checkOut);
  if (payload.rating !== undefined) form.append("rating", String(payload.rating));
  if (payload.reviewsCount !== undefined) form.append("reviews_count", String(payload.reviewsCount));
  if (payload.cancellationPolicy) form.append("cancellation_policy", payload.cancellationPolicy);
  if (payload.roomService) form.append("room_service", payload.roomService);
  form.append("breakfast_included", String(payload.breakfastIncluded ?? false));
  form.append("pets_allowed", String(payload.petsAllowed ?? false));
  if (payload.smokingPolicy) form.append("smoking_policy", payload.smokingPolicy);
  if (payload.parking) form.append("parking", payload.parking);
  form.append("accessible", String(payload.accessible ?? true));
  if (payload.specialFeatures) form.append("special_features", JSON.stringify(payload.specialFeatures));

  const coverImageFile = (payload as any).coverImageFile;
  if (coverImageFile) form.append("cover_image", coverImageFile);

  const galleryFiles = (payload as any).galleryFiles;
  if (galleryFiles && Array.isArray(galleryFiles)) {
    galleryFiles.forEach((file: File) => {
      form.append("gallery_images", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return handleResponse(response);
};

export const deleteRoom = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/rooms/${id}/`, {
    method: "DELETE",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
};

export const uploadGalleryImage = async (file: File, title: string, is_featured: boolean, token: string) => {
  if (!token) throw new Error("Login required.");
  const form = new FormData();
  form.append("image", file);
  if (title) form.append("title", title);
  form.append("is_featured", String(is_featured));

  const response = await fetch(`${API_BASE_URL}/admin/gallery/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return handleResponse(response);
};

export const deleteGalleryImage = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/gallery/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateGalleryImage = async (id: number, payload: { title?: string; is_featured?: boolean }, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/gallery/${id}/`, {
    method: "PATCH",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify(payload),
  });
};

export type UserBooking = {
  id: number;
  room: number;
  room_detail: Room;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  created_at: string;
};

export type AdminBooking = {
  id: number;
  user: AuthenticatedUser;
  room_detail: Room;
  room: number;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  created_at: string;
};

export const fetchUserBookings = async (token: string): Promise<UserBooking[]> => {
  if (!token) throw new Error("Login required.");
  const data = await apiFetch("/bookings/", {
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!Array.isArray(data)) return [];
  return data as UserBooking[];
};

export const fetchAdminBookings = async (token: string): Promise<AdminBooking[]> => {
  if (!token) throw new Error("Login required.");
  const data = await apiFetch("/admin/bookings/", {
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!Array.isArray(data)) return [];
  return data as AdminBooking[];
};

export const updateBookingStatus = async (id: number, status: string, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/bookings/${id}/`, {
    method: "PATCH",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify({ status }),
  });
};

export const fetchUsers = async (token: string): Promise<AuthenticatedUser[]> => {
  if (!token) throw new Error("Login required.");
  const data = await apiFetch("/admin/users/", {
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!Array.isArray(data)) return [];
  return data as AuthenticatedUser[];
};

export const createUser = async (payload: { username: string; email: string; password: string; is_staff?: boolean }, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch("/admin/users/", {
    method: "POST",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify(payload),
  });
};

export const updateUser = async (id: number, payload: Partial<AuthenticatedUser>, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/users/${id}/`, {
    method: "PATCH",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify(payload),
  });
};

export const deleteUser = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/users/${id}/`, {
    method: "DELETE",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
};

export const fetchTeam = async () => fetchTeamMembers();

export const createTeamMember = async (payload: { name: string; role: string; image_url?: string; order?: number }, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch("/admin/team/", {
    method: "POST",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify(payload),
  });
};

export const updateTeamMember = async (id: number, payload: { name?: string; role?: string; image_url?: string; order?: number }, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/team/${id}/`, {
    method: "PATCH",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify(payload),
  });
};

export const deleteTeamMember = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/team/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const submitContactMessage = async (payload: { name: string; email: string; subject: string; message: string }) => {
  return apiFetch("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchContactMessages = async (token: string): Promise<ContactMessage[]> => {
  if (!token) throw new Error("Login required.");
  const data = await apiFetch("/admin/messages/", {
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!Array.isArray(data)) return [];
  return data as ContactMessage[];
};

export const markMessageAsRead = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/messages/${id}/`, {
    method: "PATCH",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
    body: JSON.stringify({ is_read: true }),
  });
};

export const deleteContactMessage = async (id: number, token: string) => {
  if (!token) throw new Error("Login required.");
  return apiFetch(`/admin/messages/${id}/`, {
    method: "DELETE",
    headers: buildHeaders({ Authorization: `Bearer ${token}` }),
  });
};
