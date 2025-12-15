export interface Room {
  number?: string;
  id: number;
  availability: boolean;
  guests: number;
  amenities: string[];
  type: "Single" | "Double" | "Family Suite" | "Suite";
  bedPreference: "Single Bed" | "Double Bed" | "Queen Size" | "King Size";
  description: string;
  price: number;
  image: string;

  // For detailed room information
  gallery: string[];
  size: string;
  floor: number;
  view: string;
  checkIn: string;
  checkOut: string;
  rating: number;
  reviewsCount: number;
  cancellationPolicy: string;
  roomService: string;
  breakfastIncluded: boolean;
  petsAllowed: boolean;
  smokingPolicy: string;
  parking: string;
  accessible: boolean;
  specialFeatures: string[];
}
