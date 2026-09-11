import React from "react";

const HeroSection = ({
  title = "AI For Business Workshop",
  subtitle = "Work Smarter, Grow Faster",
  eventDate = "August 6, 2026",
  venue = "Renaissance University...",
  organizer = "Renaissance University, Indore (M.P.)",
  logo = 'https://renaissancetutorials.com/assets/logo.png',
}) => {
  return (
    <section className="bg-gradient-to-br from-[#c8e6c0] via-[#d9f0d3] to-[#b2d9a8]  px-12 py-10 flex items-center justify-between gap-6 flex-wrap rounded-md">
      
      {/* Left Content */}
      <div className="flex-1 min-w-[280px]">
        <h1 className="text-[2.2rem] font-extrabold text-[#2b7818] leading-tight mb-2">
          {title}
        </h1>
        <p className="text-base text-gray-500 mb-3">{subtitle}</p>

        {/* Description */}
        <div className="mb-7">
          <h2 className="text-[1.05rem] font-bold text-gray-800 mb-1">
            Career Guidance &amp; Higher Education Awareness Seminar 2026
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Renaissance University organizes career awareness and higher education guidance seminars for Class 12th students across Madhya Pradesh schools. Students who attended the seminar can register here to receive their official participation certificate.
          </p>
        </div>

        {/* Info Cards */}
        <div className="flex gap-4 flex-wrap">

          {/* Event Date */}
          <div className="border-[1.5px] border-[#2b7818] rounded-xl px-4 py-3 bg-[#f4faf2] min-w-[140px]">
            <span className="block text-[0.6rem] tracking-widest text-[#2b7818] font-bold uppercase mb-1">
              Event Date
            </span>
            <div className="flex items-center gap-2">
              <svg
                className="w-[18px] h-[18px] stroke-[#2b7818]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm font-bold text-gray-900">{eventDate}</span>
            </div>
          </div>

          {/* Venue */}
          <div className="border-[1.5px] border-[#2b7818] rounded-xl px-4 py-3 bg-[#f4faf2] min-w-[140px]">
            <span className="block text-[0.6rem] tracking-widest text-[#2b7818] font-bold uppercase mb-1">
              Venue
            </span>
            <div className="flex items-center gap-2">
              <svg
                className="w-[18px] h-[18px] stroke-[#2b7818]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm font-bold text-gray-900">{venue}</span>
            </div>
          </div>

          {/* Organizer */}
          <div className="border-[1.5px] border-[#2b7818] rounded-xl px-4 py-3 bg-[#f4faf2] min-w-[140px]">
            <span className="block text-[0.6rem] tracking-widest text-[#2b7818] font-bold uppercase mb-1">
              Organizer
            </span>
            <div className="flex items-center gap-2">
              <svg
                className="w-[18px] h-[18px] stroke-[#2b7818]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span className="text-sm font-bold text-gray-900">{organizer}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right — Logo */}
      <div className="flex flex-col items-center gap-2 min-w-[120px]">
       
        {logo ? (
          <img
            src={logo}
            alt="Organizer Logo"
            className="w-[400px] h-[200px] object-contain"
          />
        ) : (
          <div className="w-[90px] h-[90px] rounded-full border-2 border-[#2b7818] bg-[#f4faf2] flex items-center justify-center">
            <svg
              className="w-10 h-10 stroke-[#2b7818]"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        )}
      </div>

    </section>
  );
};

export default HeroSection;
