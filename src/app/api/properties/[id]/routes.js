import { connectDB } from "@/app/lib/mongodb";
import { Property } from "@/app/models/Property";

export async function GET(req, context) {
  await connectDB()
  const { id } = context.params;

  const property = await Property.findById(id);
  if (!property) return new Response("Not Found", { status: 404 });

  // increment view count
  property.views = (property.views || 0) + 1;
  await property.save();

  return Response.json(property);
}