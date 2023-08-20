import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  IUser,
  IUserInterest,
  IUserPhysicalMeasurement,
  IUserProfile,
} from '../interfaces/user.interface';

export const User = new mongoose.Schema<IUser>(
  {
    id: { type: String, required: true, default: () => uuidv4() },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const Measurement = new mongoose.Schema<IUserPhysicalMeasurement>(
  {
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false },
);

export const UserProfile = new mongoose.Schema<IUserProfile>(
  {
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: String, required: true },
    profileImage: { type: String, default: null },
    horoscope: { type: String, default: null },
    zodiac: { type: String, default: null },
    weight: {
      type: Measurement,
    },
    height: {
      type: Measurement,
    },
  },
  { timestamps: true },
);

export const UserInterest = new mongoose.Schema<IUserInterest>(
  {
    userId: { type: String, required: true },
    interests: { type: [String], required: true },
  },
  { timestamps: true },
);
