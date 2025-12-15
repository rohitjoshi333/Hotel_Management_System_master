// src/constants/NavLinks.ts
export type NavLink = {
    name: string;
    path: string;
  };
  
  export const NavLinks: NavLink[] = [
    { name: "Explore", path: "/" },
    { name: "Book a Room", path: "/allRooms" },
    { name: "About Us", path: "/aboutUs" },
    { name: "Contact Us", path: "/contactUs" },
    { name: "Gallery", path: "/gallery" },
  ];
  