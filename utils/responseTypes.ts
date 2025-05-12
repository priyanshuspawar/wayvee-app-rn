export type UploadedImage = {
  imgUrl: string;
  id: string;
};

export type UploadResponse = {
  message: string;
  data: UploadedImage[];
};

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  picture: string;
  countryCode: string;
  governmentId: string | null;
  isAgent: boolean;
  isMember: boolean;
  dateOfBirth: string; // or Date if you plan to convert it
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

interface OtpApiResponse {
  message: string;
  data: UserData;
  token: string;
}

interface Stay {
  id: string;
  isPublished: boolean;
  hostId: string;
  title: string | null;
  location: {
    x: number;
    y: number;
  } | null;
  displayImages: {
    id: string;
    imageUrl: string;
    type: string;
  }[];
  perks: string[];
  baseGuest: number;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  currentTab: number;
  pricePerNight: string | null; // decimal returns as string
  perPersonIncrement: string | null; // decimal returns as string
  maxOccupancy: number | null;
  amenities: string[];
  availability: boolean | null;
  typeOfStay: string | null; // char returns as string
  propertyAccess: string | null; // char returns as string
  rating: string; // decimal returns as string
  discount: string | null; // decimal returns as string
  address: {
    name: string;
    streetAddress: string;
    nearby_landmark: string;
    district: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GetStayResponse {
  message: string;
  data: Stay;
}

export type { OtpApiResponse, GetStayResponse, Stay };
