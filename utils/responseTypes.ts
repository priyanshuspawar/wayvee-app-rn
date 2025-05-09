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

export type { OtpApiResponse };
