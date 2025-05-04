export type UploadedImage = {
  imgUrl: string;
  id: string;
};

export type UploadResponse = {
  message: string;
  data: UploadedImage[];
};
