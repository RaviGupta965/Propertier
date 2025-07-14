import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  ownerName: String,
  contact: String,
  altContact: String,
  locality: String,
  address: String,
  spaceType: String,
  petsAllowed: String,
  preference: String,
  bachelors: String,
  furnishing: String,
  bhk: Number,
  floor: String,
  landmark: String,
  washroom: String,
  cooling: String,
  carParking: String,
  rent: Number,
  maintenance: Number,
  area: String,
  appliances: [String],
  amenities: [String],
  about: String,
  photos: [String],
  views: { type: Number, default: 0 },
}, { timestamps: true });

export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);