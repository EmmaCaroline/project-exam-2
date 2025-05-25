import { useState } from "react";
import { API_VENUES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import { useNavigate } from "react-router-dom";

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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = user?.name;

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

    setErrorMessage("");
    setSuccessMessage("");

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
        setSuccessMessage("Venue created successfully!");
        setFormData({
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

        if (profileName) {
          setTimeout(() => navigate(`/profile/${profileName}`), 2000);
        }
      } else {
        setErrorMessage(
          data.message || "Error creating venue. Please try again.",
        );
      }
    } catch {
      setErrorMessage(
        "Submission failed. Please check your internet connection.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-80 md:w-96 mx-auto p-6 mt-8 space-y-6 bg-white rounded-lg shadow-lg border border-customBlue font-body"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Create a New Venue
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Venue Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
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
          rows={4}
          required
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
          name="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
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
          name="maxGuests"
          type="number"
          min="1"
          value={formData.maxGuests}
          onChange={handleChange}
          required
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
          name="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-gray-900">Images</h3>
        {formData.media.map((media, index) => (
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
              onChange={(e) => handleMediaChange(index, "url", e.target.value)}
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            />
            <label
              htmlFor={`media-alt-${index}`}
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Alt Text
            </label>
            <input
              id={`media-alt-${index}`}
              type="text"
              value={media.alt}
              onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
              className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            htmlFor="city"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
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
            name="country"
            type="text"
            value={formData.location.country}
            onChange={handleChange}
            className="w-full p-3 border border-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full text-center py-3">
        Create Venue
      </button>

      {errorMessage && (
        <div className="text-red-900 bg-red-200 border border-red-500 rounded-md p-2 mt-3 font-semibold">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="text-green-700 bg-green-100 border border-green-400 rounded-md p-2 mt-3 font-semibold">
          {successMessage}
        </div>
      )}
    </form>
  );
};

export default CreateVenue;
