import { connectDB } from "@/app/lib/mongodb.js";
import { Property } from "@/app/models/Property.js";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  const filters = {};
  if (searchParams.get("spaceType")) {
    filters.spaceType = searchParams.get("spaceType");
  }
  if (searchParams.get("locality")) {
    filters.locality = { $regex: searchParams.get("locality"), $options: "i" };
  }

  const total = await Property.countDocuments(filters);
  const properties = await Property.find(filters)
    .sort({ [sort]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  return Response.json({ total, properties });
}
