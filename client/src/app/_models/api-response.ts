export interface UploadResponse {
  key: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  expiresIn?: number;
}

export interface Clip {
  key: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  url: string;
  thumbnailUrl: string;
}
export interface UserResponse {
  username: string;
  clips: Clip[];
}
