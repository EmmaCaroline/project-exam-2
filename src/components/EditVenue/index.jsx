import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_VENUES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalVenue, setOriginalVenue] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = user?.name;

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

  const isEqual = (currentData, originalData) =>
    JSON.stringify(currentData) === JSON.stringify(originalData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    if (isEqual(formData, originalVenue)) {
      setSubmitError("No changes made to venue.");
      setTimeout(() => navigate(`/profile/${profileName}`), 1500);
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
        setSuccessMessage("Venue updated successfully!");
        setTimeout(() => navigate(`/venue/${id}`), 1500);
      } else {
        setSubmitError(data.errors?.[0]?.message || "Unknown update error");
      }
    } catch (error) {
      setSubmitError(error.message || "Submission error");
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
    <form
      onSubmit={handleSubmit}
      className="md:w-[700px] mx-auto p-6 mt-8 space-y-6 bg-white rounded-lg shadow-lg border border-customBlue font-body"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Venue</h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Venue Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="maxGuests"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Max Guests
        </label>
        <input
          id="maxGuests"
          type="number"
          name="maxGuests"
          value={formData.maxGuests}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Rating (optional)
        </label>
        <input
          id="rating"
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-gray-900">Images</h3>
        {Array.isArray(formData.media) &&
          formData.media.map((media, index) => (
            <div key={index} className="mb-4">
              <label
                htmlFor={`media-url-${index}`}
                className="block mb-1 text-sm font-semibold text-gray-700"
              >
                Image URL
              </label>
              <input
                id={`media-url-${index}`}
                type="url"
                value={media.url}
                onChange={(e) =>
                  handleMediaChange(index, "url", e.target.value)
                }
                className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
              />
              <label
                htmlFor={`media-alt-${index}`}
                className="block mb-1 text-sm font-semibold text-gray-700"
              >
                Alt Text
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`media-alt-${index}`}
                  type="text"
                  value={media.alt}
                  onChange={(e) =>
                    handleMediaChange(index, "alt", e.target.value)
                  }
                  className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

      <fieldset className="space-y-2">
        <legend className="font-semibold text-gray-900">Amenities</legend>
        {["wifi", "parking", "breakfast", "pets"].map((option) => (
          <label key={option} className="block text-sm text-gray-700">
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

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Location (optional)</h3>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.location.city}
            onChange={handleChange}
            className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            name="country"
            value={formData.location.country}
            onChange={handleChange}
            className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      {successMessage && (
        <div className="p-3 text-green-700 bg-green-100 border border-green-400 rounded">
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className="p-3 text-red-700 bg-red-100 border border-red-400 rounded">
          {submitError}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full text-center py-3">
        Save Changes
      </button>
    </form>
  );
};

export default EditVenue;
