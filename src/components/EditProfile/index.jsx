import { useState, useEffect } from "react";
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-8 sm:mx-auto space-y-4 mt-8"
    >
      <h2 className="font-heading text-lg md:text-xl lg:text-2xl block font-medium mb-1">
        Edit profile
      </h2>
      <div>
        <label
          htmlFor="avatarUrl"
          className="font-body text-sm md:text-base mb-2"
        >
          New Avatar Image
        </label>
        <input
          id="avatarUrl"
          type="url"
          placeholder="Full image URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {currentAvatarUrl && (
          <img
            src={currentAvatarUrl}
            alt="Current avatar"
            className="mt-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
      </div>

      <div>
        <label
          htmlFor="venueManager"
          className="inline-flex items-center space-x-2"
        >
          <input
            id="venueManager"
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
            className="mt-10"
          />
          <span className="font-body text-sm md:text-base mt-10">
            Become a Venue Manager
          </span>
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default EditProfile;
