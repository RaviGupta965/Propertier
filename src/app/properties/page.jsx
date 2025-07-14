"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    spaceType: "",
    locality: "",
    sort: "createdAt",
    order: "desc",
  });

  const limit = 6;

  useEffect(() => {
    const fetchProperties = async () => {
      const query = new URLSearchParams({
        page,
        limit,
        sort: filters.sort,
        order: filters.order,
        ...(filters.spaceType && { spaceType: filters.spaceType }),
        ...(filters.locality && { locality: filters.locality }),
      });

      const res = await fetch(`/api/properties/list?${query}`);
      const data = await res.json();
      setProperties(data.properties);
      setTotal(data.total);
    };

    fetchProperties();
  }, [page, filters]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Browse Properties</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Search by locality"
          onChange={(e) => setFilters({ ...filters, locality: e.target.value })}
        />
        <select
          onChange={(e) => setFilters({ ...filters, spaceType: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="Flat">Flat</option>
          <option value="House">House</option>
          <option value="PG">PG</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="createdAt">Newest</option>
          <option value="rent">Rent</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, order: e.target.value })}
        >
          <option value="desc">High to Low</option>
          <option value="asc">Low to High</option>
        </select>
      </div>

      {/* Property Grid */}
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

      {/* Pagination Controls */}
      <div className="flex gap-4 justify-center mt-6">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ⬅ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next ➡
        </button>
      </div>
    </div>
  );
}
