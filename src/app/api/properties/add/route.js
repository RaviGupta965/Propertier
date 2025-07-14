import { connectDB } from '@/app/lib/mongodb';
import { Property } from '@/app/models/Property';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  await connectDB();

  const formData = await req.formData();

  const fieldNames = [
    'ownerName', 'contact', 'altContact', 'locality', 'address', 'spaceType',
    'petsAllowed', 'preference', 'bachelors', 'furnishing', 'bhk', 'floor',
    'landmark', 'washroom', 'cooling', 'carParking', 'rent', 'maintenance',
    'area', 'about'
  ];

  const doc = {};
  for (const name of fieldNames) {
    doc[name] = formData.get(name) || '';
  }

  doc.appliances = formData.getAll('appliances');
  doc.amenities = formData.getAll('amenities');
  doc.photos = formData.getAll('photos');

  if (!doc.photos || doc.photos.length === 0) {
    return Response.json({ error: 'At least 1 photo is required' }, { status: 400 });
  }

  const newProperty = await Property.create(doc);
  return Response.json({ success: true, property: newProperty });
}