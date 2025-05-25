import React, { useState, useEffect } from "react";
import { getHeaders } from "../../utils/headers";
import { API_PROFILES } from "../../utils/constants";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      console.error("Username is undefined!");
      return;
    }
    async function fetchProfile() {
      try {
        console.log("Fetching profile for user:", username);
        const res = await fetch(`${API_PROFILES}/${username}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const json = await res.json();

        setVenueManager(json.data.venueManager || false);
        setCurrentAvatarUrl(json.data.avatar?.url || null);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const updateData = {
        venueManager,
      };

      if (avatarUrl.trim() !== "") {
        updateData.avatar = {
          url: avatarUrl.trim(),
          alt: "User avatar",
        };
      }

      const response = await fetch(`${API_PROFILES}/${username}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.errors?.map((e) => e.message).join(", ") ||
            "Failed to update profile",
        );
      }

      setMessage("Profile updated successfully!");
      setAvatarUrl("");
      if (updateData.avatar) {
        setCurrentAvatarUrl(updateData.avatar.url);
      }
      navigate(`/profile/${username}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="avatarUrl" className="block font-medium mb-1">
          New Avatar Image URL
        </label>
        <input
          id="avatarUrl"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Leave blank to keep your current avatar.
        </p>
        {currentAvatarUrl && (
          <img
            src={currentAvatarUrl}
            alt="Current avatar"
            className="mt-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
      </div>

      <div>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
          <span>Become a Venue Manager</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default EditProfile;
