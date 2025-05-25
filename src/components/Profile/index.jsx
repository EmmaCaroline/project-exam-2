import { API_PROFILES, API_BOOKING } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchBookingsByProfile } from "../../utils/fetchBookingsByProfile";
import BookingCard from "../UI/Bookingcard";
import ConfirmModal from "../UI/ConfirmModal";
import { fetchVenuesByProfile } from "../../utils/fetchVenuesByProfile";
import VenueCard from "../UI/Venuecard";
import { IoIosCreate } from "react-icons/io";

/**
 * Profile component displays user profile data including bookings and venues.
 * Fetches profile info, bookings, and venues (if user is a venue manager) on mount.
 * Allows deleting bookings with confirmation modal.
 *
 * @component
 * @returns {JSX.Element} The rendered profile page component.
 */
const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [venues, setVenues] = useState([]);

  /**
   * Opens the confirmation modal to delete a booking.
   *
   * @param {string|number} id - The ID of the booking to delete.
   * @returns {void}
   */
  const openConfirm = (id) => {
    setSelectedBookingId(id);
    setConfirmOpen(true);
  };

  /**
   * Closes the confirmation modal and resets the selected booking ID.
   *
   * @returns {void}
   */
  const closeConfirm = () => {
    setSelectedBookingId(null);
    setConfirmOpen(false);
  };

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

        if (json.data.venueManager) {
          const venuesData = await fetchVenuesByProfile(username);
          setVenues(venuesData);
        }

        const bookingsData = await fetchBookingsByProfile(username);
        setBookings(bookingsData);
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

  /**
   * Deletes a booking by selectedBookingId.
   * Calls DELETE API, updates local bookings state, and closes confirmation modal.
   * Alerts the user if deletion fails.
   *
   * @async
   * @returns {Promise<void>} Resolves after deletion attempt.
   */
  const deleteBooking = async () => {
    if (!selectedBookingId) return;

    try {
      const response = await fetch(`${API_BOOKING}/${selectedBookingId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBookingId),
      );

      closeConfirm();
    } catch (error) {
      alert(error.message || "An error occurred while deleting booking");
    }
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <>
      <div className="mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28 my-6 md:my-10">
        <div className="mb-4 flex items-center justify-between ">
          <span className="flex items-center flex-shrink-0 gap-4">
            {profile.avatar?.url && (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || "Profile avatar"}
                className="w-14 h-14 md:w-32 md:h-32 rounded-full border-2 object-cover"
              />
            )}
            <h1 className="font-heading text-lg md:text-xl lg:text-2xl mb-2">
              {profile.name}
            </h1>
          </span>
          <Link to={`/editprofile/${username}`}>
            <span className="flex items-center flex-shrink-0 gap-2">
              <FaUserEdit className="text-xl lg:text-2xl" />
              <button className="font-body text-sm md:text-base hidden md:flex">
                Edit profile
              </button>
            </span>
          </Link>
        </div>
        <hr className="border-t-1 border-secondary pt-1 pb-2" />
        <h2 className="font-heading font-bold text-lg md:text-xl lg:text-2xl my-4">
          Your bookings
        </h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings
              .filter((booking) => booking.venue)
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onDelete={() => openConfirm(booking.id)}
                />
              ))}
          </div>
        )}
        {profile.venueManager && (
          <>
            <div className="flex items-center justify-between mt-8 mb-4">
              <h2 className="font-heading font-bold text-lg md:text-xl lg:text-2xl">
                Your venues
              </h2>
              <Link to="/createvenue">
                <span className="flex items-center flex-shrink-0 gap-2">
                  <IoIosCreate className="text-xl lg:text-2xl" />
                  <button className="font-body text-sm md:text-base md:flex">
                    Create Venue
                  </button>
                </span>
              </Link>
            </div>

            {venues.length === 0 ? (
              <p>No venues found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onConfirm={deleteBooking}
        onCancel={closeConfirm}
        message="Are you sure you want to delete this booking?"
      />
    </>
  );
};

export default Profile;
