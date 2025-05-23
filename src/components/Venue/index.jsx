import { API_VENUES } from "../../utils/constants";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DefaultImage from "../../assets/No_Image_Available.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GrNext, GrPrevious } from "react-icons/gr";

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:w-full overflow-hidden">
        {/* Swiper Carousel */}
        <div className="relative w-full md:w-1/2 h-80 lg:h-[450px]">
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
            loop={true}
            className="w-full h-full"
          >
            {mediaArray.map((mediaItem, index) => (
              <SwiperSlide key={index}>
                <img
                  src={mediaItem.url}
                  alt={mediaItem.alt}
                  className="object-cover object-center w-full h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Prev Button */}
          <button
            ref={prevRef}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full z-10"
            aria-label="Previous Slide"
          >
            <GrPrevious className="w-4 md:w-6 h-4 lg:h-6" />
          </button>

          {/* Custom Next Button */}
          <button
            ref={nextRef}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full z-10"
            aria-label="Next Slide"
          >
            <GrNext className="w-4 md:w-6 h-4 lg:h-6" />
          </button>
        </div>

        {/* Venue Info */}
        <div className="w-full md:w-1/2 sm:p-4 ml-8 sm:ml-1 mt-4 sm:mt-0">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4 mr-8 lg:mr-20 break-words">
            {data.name}
          </h2>
          <div className="flex justify-between items-center mr-14 sm:mr-8">
            <p className="mb-4 font-body text-sm md:text-base">
              {data.location.city}, {data.location.country}
            </p>
            <p>{data.rating.toFixed(1)}</p>
          </div>
          <div className="flex items-center mb-4">
            <img
              src={data.owner?.avatar?.url || ""}
              alt={data.owner?.avatar?.alt || ""}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-body text-sm md:text-base">{data.owner.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue;
