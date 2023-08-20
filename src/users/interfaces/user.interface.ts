export interface IUserPhysicalMeasurement {
  value: number;
  unit: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface IUserProfile {
  userId: string;
  displayName?: string;
  profileImage?: string;
  gender?: string;
  birthday?: string;
  horoscope?: string;
  zodiac?: string;
  height?: IUserPhysicalMeasurement;
  weight?: IUserPhysicalMeasurement;
  interests?: string[];
  email?: string;
  username?: string;
}

export interface IUserInterest {
  userId: string;
  interests: string[];
}
