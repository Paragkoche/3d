import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Change this to your FastAPI backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add JWT token from localStorage to all requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// -------------------- API FUNCTIONS -------------------- //

/**
 * Login and store the token.
 */
export async function login(
  username: string,
  password: string
): Promise<string> {
  const response = await api.post("/auth/login", null, {
    params: { username, password },
  });
  const token = response.data.access_token;
  localStorage.setItem("token", token);
  return token;
}

/**
 * Upload a model with background colors and fiber images.
 */
export async function uploadModelWithFibers(
  name: string,
  bg: string, // Comma-separated colors e.g. "#FFFFFF,#000000"
  modelFile: File,
  fiberFiles: File[]
) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bg", bg);
  formData.append("model_file", modelFile);

  fiberFiles.forEach((fiberFile) => {
    formData.append("fiber_files", fiberFile);
  });

  const response = await api.post("/models/create_with_fibers/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/**
 * Fetch all models.
 */
export async function getModels() {
  const response = await api.get("/models/");
  return response.data;
}

// -------------------- OPTIONAL UTILS -------------------- //

/**
 * Logout by clearing the stored token.
 */
export function logout() {
  localStorage.removeItem("token");
}
