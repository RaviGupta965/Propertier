import { connectDB } from '@/app/lib/mongodb';
import { Property } from '@/app/models/Property';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  return {
    title: `Property #${params.id}`,
  };
}

export default async function PropertyDetails({ params }) {
  await connectDB();
  const property = await Property.findById(params.id).lean();

  if (!property) {
    return <div className="p-6 text-red-600">Property not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Property by {property.ownerName}</h1>
      <p className="text-gray-600 mb-2">{property.locality}, {property.address}</p>
      <p className="mb-2">Type: {property.spaceType} | BHK: {property.bhk}</p>
      <p className="mb-4 text-sm">{property.about}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {property.photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`photo-${i}`}
            className="w-full h-48 object-cover rounded shadow"
          />
        ))}
      </div>

      <div className="mt-6">
        <p><strong>Contact:</strong> {property.contact}</p>
        <p><strong>Rent:</strong> ₹{property.rent}</p>
        <p><strong>Maintenance:</strong> ₹{property.maintenance}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}