import { useState, useEffect, useRef } from "react";
import HeroSection from "../components/reusable/heroSection";
import Footer from "../components/reusable/footer";
import { getActiveSeminar, registerStudent } from "../services/seminarService";
import Certificate from "./certificate";

const STATES_CITIES = {
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Chhatarpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Jalgaon"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Ghaziabad", "Noida", "Bareilly", "Aligarh"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Morbi", "Bharuch"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi", "Davangere", "Ballari", "Vijayapura", "Shivamogga", "Tumkur"],
};

const EDUCATION_BOARDS = [
  { label: "CBSE (Central Board of Secondary Education)", value: "CBSE" },
  { label: "ICSE (Indian Certificate of Secondary Education)", value: "ICSE" },
  { label: "MP Board (Madhya Pradesh Board)", value: "MP_BOARD" },
  { label: "UP Board (Uttar Pradesh Madhyamik Shiksha Parishad)", value: "UP_BOARD" },
  { label: "Rajasthan Board (RBSE)", value: "RBSE" },
  { label: "Other State Board", value: "OTHER" },
];

const STREAMS = [
  { label: "Science (PCM) – Physics, Chemistry, Maths", value: "PCM" },
  { label: "Science (PCB) – Physics, Chemistry, Biology", value: "PCB" },
  { label: "Commerce", value: "COMMERCE" },
  { label: "Arts / Humanities", value: "ARTS" },
  { label: "Agriculture", value: "AGRICULTURE" },
  { label: "Other", value: "OTHER" },
];

const StudentForm = () => {
  // ── seminar state ──────────────────────────────────────────────────────────
  const [seminar, setSeminar] = useState(null);
  const [seminarLoading, setSeminarLoading] = useState(true);
  const [seminarError, setSeminarError] = useState("");

  // ── form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    whatsappNumber: "",
    sameAsMobile: false,
    emailAddress: "",
    schoolName: "",
    educationBoard: "",
    stream: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registration, setRegistration] = useState(null); // holds API response data
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  // ── fetch active seminar on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const data = await getActiveSeminar();
        setSeminar(data);
      } catch (err) {
        setSeminarError(err.message);
      } finally {
        setSeminarLoading(false);
      }
    };
    fetchSeminar();
  }, []);

  // ── helpers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sameAsMobile") {
      setFormData((prev) => ({
        ...prev,
        sameAsMobile: checked,
        whatsappNumber: checked ? prev.mobileNumber : "",
      }));
      if (checked) setErrors((prev) => ({ ...prev, whatsappNumber: "" }));
      return;
    }

    if (name === "mobileNumber") {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: value,
        whatsappNumber: prev.sameAsMobile ? value : prev.whatsappNumber,
      }));
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      return;
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, city: "" }));
      setErrors((prev) => ({ ...prev, state: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (!formData.sameAsMobile && !/^\d{10}$/.test(formData.whatsappNumber))
      newErrors.whatsappNumber = "WhatsApp number is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) newErrors.emailAddress = "Enter a valid email address.";
    if (!formData.schoolName.trim()) newErrors.schoolName = "School / institution name is required.";
    if (!formData.educationBoard) newErrors.educationBoard = "Please select your education board.";
    if (!formData.stream) newErrors.stream = "Please select your stream.";
    if (!formData.state) newErrors.state = "Please select your state.";
    if (!formData.city) newErrors.city = "Please select your city.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build payload — keys must match the API contract exactly
    const payload = {
      seminarId: seminar.id,
      fullName: formData.fullName.trim(),
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber,
      email: formData.emailAddress.trim(),
      schoolName: formData.schoolName.trim(),
      board: formData.educationBoard,
      course: formData.stream,
      state: formData.state,
      city: formData.city,
    };

    setSubmitting(true);
    try {
      const data = await registerStudent(payload);
      setRegistration(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── sub-components ─────────────────────────────────────────────────────────
  const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const inputBase =
    "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";

  const errorBorder = "border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-400";
  const ErrorMsg = ({ msg }) =>
    msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

  const DetailRow = ({ label, value, mono, accent }) => (
    <div className="flex items-center justify-between px-5 py-3.5 gap-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0">{label}</p>
      <p className={`text-sm text-right break-all ${mono ? "font-mono" : "font-semibold"} ${accent ? "text-indigo-500" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );

  // ── loading screen ─────────────────────────────────────────────────────────
  if (seminarLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
        <HeroSection />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm font-medium">Loading seminar details…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── seminar fetch error screen ─────────────────────────────────────────────
  if (seminarError) {
    return (
      <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
        <HeroSection />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Unable to Load Seminar</h2>
            <p className="text-sm text-gray-500">{seminarError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── success / certificate screen ──────────────────────────────────────────
  if (registration) {
    return (
      <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
        <HeroSection />
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full">

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                {/* badge-check style icon */}
                <svg className="w-9 h-9 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Certificate Issued Successfully</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your details have been saved by{" "}
                <span className="font-semibold text-indigo-600">Renaissance University</span>. Your participation
                certificate has been generated and is ready to download.
              </p>
            </div>

            {/* Details card */}
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 mb-5">
              <DetailRow label="PARTICIPANT NAME" value={registration.fullName} />
              <div className="px-5 py-3.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PROGRAM / SEMINAR</p>
                <p className="text-sm font-semibold text-indigo-600 leading-snug">{registration.seminarTitle}</p>
              </div>
              <DetailRow label="SCHOOL" value={registration.schoolName} />
              <DetailRow label="REGISTERED EMAIL" value={registration.email} mono />
              <DetailRow label="CERTIFICATE ID" value={registration.certificateId} mono accent />
            </div>

            {/* Email notice */}
            <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3.5 mb-5">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <p className="text-xs text-green-800 leading-relaxed">
                <span className="font-bold">Certificate sent to your email!</span> A copy of your certificate has been
                dispatched to <span className="font-semibold">{registration.email}</span>. Check your inbox (and spam folder).
              </p>
            </div>

            {/* Download button */}
            <button
              onClick={async () => {
                setDownloading(true);
                try {
                  const html2canvas = (await import("html2canvas")).default;
                  const { jsPDF } = await import("jspdf");
                  const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
                  const imgData = canvas.toDataURL("image/png");
                  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
                  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
                  pdf.save(`certificate-${registration.certificateId}.pdf`);
                } finally {
                  setDownloading(false);
                }
              }}
              disabled={downloading}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl py-4 flex items-center justify-center gap-2 transition-colors"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating PDF…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
                  </svg>
                  Download Certificate (PDF)
                </>
              )}
            </button>

            {/* Hidden certificate for PDF rendering */}
            <div style={{ position: "fixed", top: "-9999px", left: "-9999px", width: "800px", height: "560px", overflow: "hidden" }}>
              <Certificate ref={certRef} registration={registration} />
            </div>

          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
      <HeroSection />

      <div className="flex-1 max-w-3xl mx-auto w-full mt-8 mb-12 px-4">
        <div className="bg-white rounded-2xl shadow-md px-8 py-9">

          {/* Seminar info banner */}
          {/* {seminar && (
            <div className="mb-6 rounded-xl bg-indigo-50 border border-indigo-100 px-5 py-4 flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-700 leading-tight">{seminar.title}</p>
                <p className="text-xs text-indigo-500 mt-0.5">{seminar.organizer} · {seminar.venue}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{seminar.description}</p>
              </div>
            </div>
          )} */}

          {/* Form header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">Student Registration Form</h2>
              <p className="text-xs text-gray-400">Fill all details carefully to receive your certificate</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Row 1 — Full Name + Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Full Name */}
              <div>
                <Label required>Full Name</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${inputBase} pl-9 ${errors.fullName ? errorBorder : ""}`}
                  />
                </div>
                <ErrorMsg msg={errors.fullName} />
              </div>

              {/* Mobile Number */}
              <div>
                <Label required>Mobile Number</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`${inputBase} pl-9 ${errors.mobileNumber ? errorBorder : ""}`}
                  />
                </div>
                <ErrorMsg msg={errors.mobileNumber} />
              </div>
            </div>

            {/* Row 2 — WhatsApp Number + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* WhatsApp Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label required>WhatsApp Number</Label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="sameAsMobile"
                      checked={formData.sameAsMobile}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                    />
                    <span className="text-xs text-gray-500 font-medium">Same as mobile</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="WhatsApp number"
                    maxLength={10}
                    disabled={formData.sameAsMobile}
                    className={`${inputBase} pl-9 ${errors.whatsappNumber ? errorBorder : ""} ${formData.sameAsMobile ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                </div>
                <ErrorMsg msg={errors.whatsappNumber} />
              </div>

              {/* Email Address */}
              <div>
                <Label required>Email Address</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`${inputBase} pl-9 ${errors.emailAddress ? errorBorder : ""}`}
                  />
                </div>
                <ErrorMsg msg={errors.emailAddress} />
              </div>
            </div>

            {/* Row 3 — School Name (full width) */}
            <div className="mb-5">
              <Label required>School / Institution Name</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter your school or institution name"
                  className={`${inputBase} pl-9 ${errors.schoolName ? errorBorder : ""}`}
                />
              </div>
              <ErrorMsg msg={errors.schoolName} />
            </div>

            {/* Row 4 — Education Board + Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Education Board */}
              <div>
                <Label required>Education Board</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </span>
                  <select
                    name="educationBoard"
                    value={formData.educationBoard}
                    onChange={handleChange}
                    className={`${inputBase} pl-9 pr-8 appearance-none ${errors.educationBoard ? errorBorder : ""}`}
                  >
                    <option value="">Select your board</option>
                    {EDUCATION_BOARDS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <ErrorMsg msg={errors.educationBoard} />
              </div>

              {/* Stream */}
              <div>
                <Label required>12th Course / Stream</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </span>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    className={`${inputBase} pl-9 pr-8 appearance-none ${errors.stream ? errorBorder : ""}`}
                  >
                    <option value="">Select your stream</option>
                    {STREAMS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <ErrorMsg msg={errors.stream} />
              </div>
            </div>

            {/* Row 5 — State + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {/* State */}
              <div>
                <Label required>State</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                    </svg>
                  </span>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`${inputBase} pl-9 pr-8 appearance-none ${errors.state ? errorBorder : ""}`}
                  >
                    <option value="">Select your state</option>
                    {Object.keys(STATES_CITIES).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <ErrorMsg msg={errors.state} />
              </div>

              {/* City */}
              <div>
                <Label required>City</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </span>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className={`${inputBase} pl-9 pr-8 appearance-none ${errors.city ? errorBorder : ""} ${!formData.state ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="">{formData.state ? "Select your city" : "Select state first"}</option>
                    {(STATES_CITIES[formData.state] || []).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
                <ErrorMsg msg={errors.city} />
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-red-600 font-medium">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !seminar}
              className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl py-4 flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  Submit Information to Claim your Certificate
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentForm;
