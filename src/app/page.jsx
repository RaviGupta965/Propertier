import Link from "next/link";

export const dynamic = "force-dynamic";

async function getRecentProperties() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/properties/list?page=1&limit=6`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.properties;
}

export default async function HomePage() {
  const properties = await getRecentProperties();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Latest Listings</h1>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((p) => (
            <Link key={p._id} href={`/properties/${p._id}`}>
              <div className="border rounded overflow-hidden">
                <img src={p.photos[0]} className="h-48 w-full object-cover" />
                <div className="p-3">
                  <h2 className="font-bold text-lg">{p.locality}</h2>
                  <p className="text-sm text-gray-500">₹{p.rent} | {p.spaceType}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/properties" className="text-blue-600 underline">
          View All Properties →
        </Link>
      </div>
    </main>
  );
}
