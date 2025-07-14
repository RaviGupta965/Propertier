"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProperty() {
  const router = useRouter();
  const [form, setForm] = useState({
    ownerName: "", contact: "", altContact: "", locality: "", address: "", spaceType: "",
    petsAllowed: "", preference: "", bachelors: "", furnishing: "", bhk: "", floor: "",
    landmark: "", washroom: "", cooling: "", carParking: "", rent: "", maintenance: "",
    area: "", appliances: [], amenities: [], about: "", photos: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length < 1) return;

    const formData = new FormData();
    for (const file of files) formData.append("images", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.urls) {
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...data.urls] }));
    } else setError("Image upload failed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.photos.length < 1) {
      setError("Please upload at least 1 photo.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (Array.isArray(value)) value.forEach((v) => formData.append(key, v));
      else formData.append(key, value);
    }

    const res = await fetch("/api/properties/add", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) router.push("/properties");
    else setError(result.error || "Something went wrong.");
  };

  const handleMultiSelect = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Add New Property</h1>
      {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["Owner Name", "ownerName"],
          ["Contact", "contact"],
          ["Alt Contact", "altContact"],
          ["Locality", "locality"],
          ["Address", "address"],
          ["Rent", "rent"],
          ["Maintenance", "maintenance"],
          ["Area (in sq ft)", "area"],
          ["BHK", "bhk"],
          ["Floor", "floor"],
          ["Landmark", "landmark"],
          ["Washroom", "washroom"],
          ["Cooling Type", "cooling"],
          ["Car Parking", "carParking"],
        ].map(([label, name]) => (
          <input
            key={name}
            placeholder={label}
            required={["ownerName", "contact", "rent"].includes(name)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          />
        ))}

        <select
          required
          className="border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, spaceType: e.target.value })}
        >
          <option value="">Space Type</option>
          <option value="Flat">Flat</option>
          <option value="House">House</option>
          <option value="PG">PG</option>
          <option value="Warehouse">Warehouse</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
        >
          <option value="">Furnishing</option>
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, petsAllowed: e.target.value })}
        >
          <option value="">Pets Allowed</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, preference: e.target.value })}
        >
          <option value="">Preference</option>
          <option value="Family">Family</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Any">Any</option>
        </select>

        <div className="md:col-span-2">
          <label className="block font-medium">Appliances</label>
          <div className="flex flex-wrap gap-3">
            {["Fridge", "Washing Machine", "Microwave", "TV", "Geyser", "AC"].map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.appliances.includes(item)}
                  onChange={() => handleMultiSelect("appliances", item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium">Amenities</label>
          <div className="flex flex-wrap gap-3">
            {["Lift", "Power Backup", "Water Supply", "Security", "Parking", "Gym"].map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(item)}
                  onChange={() => handleMultiSelect("amenities", item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea
          placeholder="About the property"
          className="md:col-span-2 border px-3 py-2 rounded h-24 resize-none"
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload at least 1 photo:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="w-full border-2 border-black"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {form.photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`property-${i}`}
                className="w-full h-32 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? "Submitting..." : "Submit Property"}
        </button>
      </form>
    </div>
  );
}
