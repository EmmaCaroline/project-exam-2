import { useState } from "react";
import { API_VENUES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    rating: "",
    media: [{ url: "", alt: "" }],
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      city: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.meta) {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: checked,
        },
      }));
    } else if (name in formData.location) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleMediaChange = (index, field, value) => {
    const updatedMedia = [...formData.media];
    updatedMedia[index][field] = value;
    setFormData((prev) => ({ ...prev, media: updatedMedia }));
  };

  const addMediaField = () => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { url: "", alt: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredMedia = formData.media.filter((media) => {
      try {
        if (!media.url.trim()) return false;
        new URL(media.url);
        return true;
      } catch {
        return false;
      }
    });

    const payload = {
      ...formData,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      rating: formData.rating ? Number(formData.rating) : 0,
      media: filteredMedia,
    };

    try {
      const response = await fetch(API_VENUES, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Venue created:", data);
      } else {
        console.error("Error creating venue:", data);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Create a New Venue</h2>

      <input
        type="text"
        name="name"
        placeholder="Venue Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        className="w-full border p-2"
        min="0"
      />

      <input
        type="number"
        name="maxGuests"
        placeholder="Max Guests"
        value={formData.maxGuests}
        onChange={handleChange}
        required
        className="w-full border p-2"
        min="1"
      />

      <input
        type="number"
        name="rating"
        placeholder="Rating (optional)"
        value={formData.rating}
        onChange={handleChange}
        className="w-full border p-2"
        min="0"
        max="5"
        step="0.1"
      />

      <div>
        <h3 className="font-medium mb-1">Images</h3>
        {formData.media.map((media, index) => (
          <div key={index} className="mb-2">
            <input
              type="url"
              placeholder="Image URL"
              value={media.url}
              onChange={(e) => handleMediaChange(index, "url", e.target.value)}
              className="w-full border p-2 mb-1"
            />
            <input
              type="text"
              placeholder="Alt text"
              value={media.alt}
              onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
              className="w-full border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMediaField}
          className="text-blue-600 hover:underline mt-1"
        >
          + Add more images
        </button>
      </div>

      <fieldset className="space-y-1">
        <legend className="font-medium">Amenities</legend>
        {["wifi", "parking", "breakfast", "pets"].map((option) => (
          <label key={option} className="block">
            <input
              type="checkbox"
              name={option}
              checked={formData.meta[option]}
              onChange={handleChange}
              className="mr-2"
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        ))}
      </fieldset>

      <div className="space-y-2">
        <h3 className="font-medium">Location (optional)</h3>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.location.city}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.location.country}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Venue
      </button>
    </form>
  );
};

export default CreateVenue;
