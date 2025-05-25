import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_VENUES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalVenue, setOriginalVenue] = useState(null);

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
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`${API_VENUES}/${id}`, {
          headers: getHeaders(),
        });
        const json = await response.json();

        if (response.ok) {
          const media =
            Array.isArray(json.data.media) && json.data.media.length > 0
              ? json.data.media
              : [{ url: "", alt: "" }];

          const venueData = {
            name: json.data.name || "",
            description: json.data.description || "",
            price: json.data.price || "",
            maxGuests: json.data.maxGuests || "",
            rating: json.data.rating || "",
            media,
            meta: {
              wifi: json.data.meta?.wifi || false,
              parking: json.data.meta?.parking || false,
              breakfast: json.data.meta?.breakfast || false,
              pets: json.data.meta?.pets || false,
            },
            location: {
              address: json.data.location?.address || "",
              city: json.data.location?.city || "",
              zip: json.data.location?.zip || "",
              country: json.data.location?.country || "",
              continent: json.data.location?.continent || "",
              lat: json.data.location?.lat || 0,
              lng: json.data.location?.lng || 0,
            },
          };

          setFormData(venueData);
          setOriginalVenue(venueData); // Save original for comparison
          setLoading(false);
        } else {
          setError(json);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || "Fetch error");
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

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

  const removeMediaField = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  //change names to something more meaningful
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEqual(formData, originalVenue)) {
      alert("No changes made to venue");
      return;
    }

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
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      rating: formData.rating ? Number(formData.rating) : 0,
      media: filteredMedia,
      meta: formData.meta,
      location: formData.location,
    };

    try {
      const response = await fetch(`${API_VENUES}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Venue updated successfully!");
        navigate(`/venues/${id}`);
      } else {
        alert(`Update failed: ${data.errors?.[0]?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Submission error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading venue data...</p>;
  if (error)
    return (
      <p>
        Error loading venue:{" "}
        {error.statusCode ? `${error.statusCode} - ${error.status}` : error}
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Venue</h2>

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
        {Array.isArray(formData.media) &&
          formData.media.map((media, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              <input
                type="url"
                placeholder="Image URL"
                value={media.url}
                onChange={(e) =>
                  handleMediaChange(index, "url", e.target.value)
                }
                className="flex-grow border p-2"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={media.alt}
                onChange={(e) =>
                  handleMediaChange(index, "alt", e.target.value)
                }
                className="flex-grow border p-2"
              />
              {formData.media.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMediaField(index)}
                  className="text-red-600 hover:underline"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              )}
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
          name="address"
          placeholder="Address"
          value={formData.location.address}
          onChange={handleChange}
          className="w-full border p-2"
        />
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
          name="zip"
          placeholder="Zip Code"
          value={formData.location.zip}
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
        <input
          type="text"
          name="continent"
          placeholder="Continent"
          value={formData.location.continent}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.location.lat}
          onChange={handleChange}
          className="w-full border p-2"
          step="any"
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.location.lng}
          onChange={handleChange}
          className="w-full border p-2"
          step="any"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditVenue;
