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
