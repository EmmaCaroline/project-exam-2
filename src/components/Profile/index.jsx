import { API_PROFILES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_PROFILES}/${username}`, {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error("Failed to fetch profile: " + errorText);
        }

        const json = await response.json();

        setProfile(json.data);
      } catch (err) {
        if (err.name === "TypeError") {
          setError("Network error, try again later");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="profile mx-auto p-4 border rounded shadow">
      <div className="mb-4">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Profile avatar"}
            className="w-20 h-20 rounded-full border-2 object-cover"
          />
        )}
      </div>

      <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>

      <p>
        Venue Manager: <strong>{profile.venueManager ? "Yes" : "No"}</strong>
      </p>
    </div>
  );
};

export default Profile;
