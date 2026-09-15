import { forwardRef } from 'react'
import leftbase from '../assets/png/leftbase.png'
import ruLogo from '../assets/png/RU Logo.png'
import seal from '../assets/png/3 2.png'
import './certificate.css'
import webinarLogo from '../assets/png/IHAA.png'
import watermark from '../assets/png/watermark.png'

const Certificate = forwardRef(({ registration }, ref) => {
  const name = registration?.fullName ?? ''
  const seminarTitle = registration?.seminarTitle ?? ''
  const certificateId = registration?.certificateId ?? ''
  const issueDate = registration?.issueDate
    ? new Date(registration.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="certificate-wrapper">
      <div className="certificate-inner" ref={ref}>
        
        {/* Left Base Decorative Image */}
        <img
          src={leftbase}
          alt="left base"
          style={{
            position: "absolute",
            top: "9px",
            left: "-28px",
            width: "495px",
            height: "550px",
            opacity: "1.5",
            pointerEvents: "none",
            userSelect: "none",
            objectFit: "cover",
            objectPosition: "left center",
          }}
        />

        {/* Inner Green Border */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            right: "14px",
            bottom: "14px",
            border: "3px solid #2DA000",
            pointerEvents: "none",
            zIndex: 1,
            inset: '40px',
          }}
        />

        {/* Watermark */}
        <img
          src={watermark}
          alt="watermark"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "560px",
            opacity: 0.15,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Certificate of Participation Title */}
        <h1
          style={{
            position: "absolute",
            top: "170px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "817px",
            height: "60px",
            margin: 0,
            fontFamily: "Lustria, serif",
            fontWeight: 400,
            fontSize: "38px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#05003E",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          CERTIFICATE OF PARTICIPATION
        </h1>

        {/* Presented To Text */}
        <div
          style={{
            position: "absolute",
            top: "240px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "669px",
            height: "171px",
            fontFamily: "Lustria, serif",
            fontWeight: 400,
            fontSize: "22px",
            lineHeight: "25px",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#05003E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            zIndex: 2,
          }}
        >
          <div>This certificate is proudly presented to</div>
          <div style={{ borderBottom: "1.5px solid #05003E", width: "280px", paddingBottom: "7px", fontWeight: 600 }}>{name}</div>
          <div>for actively participating in</div>
          <div style={{ borderBottom: "1.5px solid #05003E", width: "420px", paddingBottom: "6px", fontWeight: 600, fontSize: "18px" }}>{seminarTitle}</div>
        </div>

        {/* Bottom Footer — Certificate ID & Issue Date */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "55px",
            right: "55px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Lustria, serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#05003E",
            zIndex: 2,
          }}
        >
          <span>Certificate ID: {certificateId}</span>
          <span>Issue Date: {issueDate}</span>
        </div>

        {/* Seal / Stamp */}
        <img
          src={seal}
          alt="seal"
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "78px",
            objectFit: "contain",
            zIndex: 2,
          }}
        />

        {/* Logo Section — top center inside border */}
        <div
          style={{
            position: "absolute",
            top: "55px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            zIndex: 2,
          }}
        >
          {/* Left Logo */}
          <img
            src={ruLogo}
            alt="RU Logo"
            style={{
              height: "80px",
              width: "auto",
              objectFit: "contain",
            }}
          />

          {/* Vertical Divider */}
          <div
            style={{
              width: "2px",
              height: "65px",
              backgroundColor: "#333",
            }}
          />

          {/* Right Logo */}
          <img
            src={webinarLogo}
            alt="webinarLogo"
            style={{
              height: "80px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>

      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;



