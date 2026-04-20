import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, RefreshCw } from "lucide-react";

export default function EventCard({ event }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const date = event?.dateTime
    ? event.dateTime?.seconds
      ? new Date(event.dateTime.seconds * 1000)
      : new Date(event.dateTime)
    : null;

  const handleFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="w-[280px] [perspective:1000px]">
      <div
        className={`relative h-[360px] w-[280px] transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Link to={`/events/${event.id}`} className="group block h-full w-full">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#081226] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative h-[140px] w-full shrink-0 overflow-hidden bg-[#1b2435]">
                {event?.bannerImage ? (
                  <img
                    src={event.bannerImage}
                    alt={event?.title || "Event banner"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}

               
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="text-xs text-white">
                    {event?.status || "Upcoming"}
                  </span>
                </div>

                <div className="mb-2 text-sm text-white">
                  {event?.category || "General"}by {event?.organizer?.name || "Unknown"}
                </div>

                <h3 className="mb-2 line-clamp-2 min-h-[44px] text-base font-bold leading-snug text-white">
                  {event?.title || "Untitled Event"}
                </h3>

                <p className="mb-3 line-clamp-2 min-h-[36px] text-xs leading-5 text-gray-300">
                  {event?.description || "No description available"}
                </p>

                <div className="mt-auto space-y-2 text-xs text-white">
                  <div className="flex items-start gap-2">
                    <CalendarDays size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {date
                        ? `${date.toLocaleDateString("en-GB")} • ${date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}`
                        : "Date not available"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {event?.location || "Location not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} className="shrink-0" />
                    <span>{event?.attendeeCount || 0} attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rotate-y-180 [backface-visibility:hidden]">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#081226] p-4 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Event Details</h3>

              <button
                type="button"
                onClick={handleFlip}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="space-y-3 overflow-auto text-sm text-gray-300">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Title
                </p>
                <p>{event?.title || "Untitled Event"}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Description
                </p>
                <p>{event?.description || "No description available"}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Category
                </p>
                <p>{event?.category || "General"}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Organizer
                </p>
                <p>{event?.organizer?.name || "Unknown"}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Location
                </p>
                <p>{event?.location || "Location not available"}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Date & Time
                </p>
                <p>
                  {date
                    ? `${date.toLocaleDateString("en-GB")} • ${date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}`
                    : "Date not available"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Attendees
                </p>
                <p>{event?.attendeeCount || 0}</p>

                 <button
                  type="button"
                  onClick={handleFlip}
                  className="absolute left-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}