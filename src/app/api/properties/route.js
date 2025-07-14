import { connectDB } from "@/app/lib/mongodb";
import { Property } from "@/app/models/Property";
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 6;
  const sort = searchParams.get('sort') || 'newest';

  const skip = (page - 1) * limit;

  const sortOptions = {
    newest: { createdAt: -1 },
    cost_low: { rent: 1 },
    cost_high: { rent: -1 },
    popular: { views: -1 },
  };

  const properties = await Property.find()
    .sort(sortOptions[sort] || sortOptions.newest)
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments();

  return Response.json({ properties, total });
}
