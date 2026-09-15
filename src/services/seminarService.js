import axiosInstance from "../api/axiosInstance";

/**
 * Fetch the currently active seminar details.
 * GET /seminars/active
 * @returns {Promise<object>} seminar data object
 */
export const getActiveSeminar = async () => {
  const response = await axiosInstance.get("/seminars/active");
  return response.data.data; // unwrap { success, message, data }
};

/**
 * Submit student registration.
 * POST /registrations
 * @param {object} payload - student form data (must include seminarId)
 * @returns {Promise<object>} registration response data object
 */
export const registerStudent = async (payload) => {
  const response = await axiosInstance.post("/registrations", payload);
  return response.data.data; // unwrap { success, message, data }
};
/**
 * Uploads frontend vector PDF to backend and triggers student email dispatch.
 * POST /certificates/upload-and-email
 * @param {string} certificateId
 * @param {string} email
 * @param {Blob} pdfBlob
 * @param {string} studentName
 * @returns {Promise<object>}
 */
export const uploadAndEmailCertificate = async (certificateId, email, pdfBlob, studentName) => {
  const formData = new FormData();
  formData.append("certificateId", certificateId);
  if (email) formData.append("email", email);
  const safeName = (studentName || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
  formData.append("file", pdfBlob, `Certificate_${safeName}.pdf`);

  const response = await axiosInstance.post("/certificates/upload-and-email", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
