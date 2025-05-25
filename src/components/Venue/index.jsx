import { API_VENUES, API_BOOKING } from "../../utils/constants";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultImage from "../../assets/No_Image_Available.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaStar, FaLocationDot, FaCheck } from "react-icons/fa6";
import CreateBooking from "../CreateBooking";
import { getHeaders } from "../../utils/headers";
import BookingList from "../UI/BookingList";
import ConfirmModal from "../UI/ConfirmModal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Venue = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { id } = useParams();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const city = data?.location?.city || "";
  const country = data?.location?.country || "";

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // State to control ConfirmModal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location =
    city && country
      ? `${city}, ${country}`
      : city || country || "Location unknown";

  useEffect(() => {
    async function getData(url) {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await fetch(url);
        const json = await response.json();
        if (json.data) {
          setData(json.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getData(`${API_VENUES}/${id}?_owner=true&_bookings=true`);
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading venue.</div>;
  if (!data) return <div>Venue not found.</div>;

  const mediaArray =
    data.media.length > 0
      ? data.media
      : [{ url: DefaultImage, alt: "No image available" }];

  const loopEnabled = mediaArray.length > 1;

  const canDelete = user?.name === data.owner.name && user?.venueManager;

  const handleBookingSubmit = async (bookingData) => {
    try {
      const response = await fetch(API_BOOKING, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...bookingData,
          venueId: data.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
    }
  };

  // Delete handlers using ConfirmModal
  const handleDelete = async () => {
    setIsModalOpen(false); // Close modal first

    try {
      const response = await fetch(`${API_VENUES}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (response.ok) {
        alert("Venue deleted successfully!");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete venue:", errorData);
        alert("Failed to delete the venue. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert("An error occurred while deleting the venue.");
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-6 sm:mx-10 md:mx-4 lg:mx-20 xl:mx-28 my-6 md:my-10">
      {canDelete && (
        <div className="flex space-x-4 my-4">
          <button
            onClick={() => navigate(`/editvenue/${id}`)}
            className="btn btn-secondary"
          >
            Edit Venue
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-secondary"
          >
            Delete Venue
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:w-full overflow-hidden">
        {/* Image Carousel */}
        <div className="relative w-full md:w-1/2 h-80 md:h-[370px] lg:h-[450px]">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{ clickable: true }}
            loop={loopEnabled}
            className="w-full h-full"
          >
            {mediaArray.map((mediaItem, index) => (
              <SwiperSlide key={index}>
                <img
                  src={mediaItem.url}
                  alt={mediaItem.alt}
                  className="object-cover object-center w-full h-full rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full z-10"
            aria-label="Previous Slide"
          >
            <GrPrevious className="w-4 md:w-6 h-4 lg:h-6" />
          </button>

          <button
            ref={nextRef}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full z-10"
            aria-label="Next Slide"
          >
            <GrNext className="w-4 md:w-6 h-4 lg:h-6" />
          </button>
        </div>

        {/* Venue Info */}
        <div className="w-full md:w-1/2 md:p-4 ml-0 md:ml-8 mt-4 md:mt-0">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4 mr-8 lg:mr-20 break-words">
            {data.name}
          </h2>
          <div className="flex justify-between items-center mr-14 md:mr-8 mb-2">
            <span className="flex items-center text-sm md:text-base font-body flex-shrink-0">
              <FaLocationDot className="mr-1 text-lg" />
              {location}
            </span>
            <span className="flex items-center text-sm md:text-base font-body flex-shrink-0">
              <FaStar className="mr-1 text-lg" />
              {data.rating.toFixed(1)}
            </span>
          </div>
          <hr className="border-t-1 border-secondary pt-1 pb-2" />
          <div className="flex items-center mb-4">
            <img
              src={data.owner?.avatar?.url || ""}
              alt={data.owner?.avatar?.alt || ""}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-body text-sm md:text-base">{data.owner.name}</p>
          </div>
          <hr className="border-t-1 border-secondary pt-1 pb-2" />
          <p className="font-body font-bold text-sm md:text-base">Facilities</p>
          <ul className="font-body text-sm md:text-base mb-4 space-y-2">
            {data.meta?.wifi && (
              <li className="flex items-center">
                <FaCheck className="mr-2 text-xl text-customButton" />
                WiFi available
              </li>
            )}
            {data.meta?.parking && (
              <li className="flex items-center">
                <FaCheck className="mr-2 text-xl text-customButton" />
                Parking available
              </li>
            )}
            {data.meta?.breakfast && (
              <li className="flex items-center">
                <FaCheck className="mr-2 text-xl text-customButton" />
                Breakfast included
              </li>
            )}
            {data.meta?.pets && (
              <li className="flex items-center">
                <FaCheck className="mr-2 text-xl text-customButton" />
                Pets allowed
              </li>
            )}
          </ul>

          <hr className="border-t-1 border-secondary pt-1 pb-2" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:w-full overflow-hidden mt-6">
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          {user?.venueManager && user?.name === data.owner.name ? (
            <BookingList bookings={data.bookings} />
          ) : (
            <CreateBooking
              venueId={data.id}
              maxGuests={data.maxGuests}
              price={data.price}
              bookings={data.bookings || []}
              isLoggedIn={!!localStorage.getItem("token")}
              onSubmitBooking={handleBookingSubmit}
            />
          )}
        </div>
        <div className="w-full md:w-1/2 ml-0 md:ml-8 mt-4 md:mt-0">
          <h2 className="font-heading text-lg md:text-xl lg:text-2xl mb-2">
            About this venue:
          </h2>
          <p>{data.description}</p>
        </div>
      </div>

      {/* ConfirmModal for delete */}
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this venue?"
      />
    </div>
  );
};

export default Venue;
