import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API; // Change this to your FastAPI backend URL

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
export interface ModelResponse {
  id: number;
  name: string;
  file_path: string;
  thumbnail_path: string;
  bg_colors: string[];
  fibers: string[];
  affected_meshes: string;
}

interface BgColor {
  id: number;
  color_code: string;
}

interface Fiber {
  id: number;
  image_path: string;
}

interface CharVariant {
  id: number;
  name: string;
  file_path: string;
  description: string;
}

export interface IdModelResponse {
  id: number;
  name: string;
  file_path: string;
  thumbnail_path: string;
  bg_colors: BgColor[];
  fibers: Fiber[];
  char_variants: CharVariant[];
  affected_meshes: string;
}

export async function getModels() {
  const response = await api.get<ModelResponse[]>("/models/");
  return response.data;
}

export async function getModelsId(id: string) {
  const response = await api.get<IdModelResponse>(`/models/${id}`);
  return response.data;
}
// -------------------- OPTIONAL UTILS -------------------- //

/**
 * Logout by clearing the stored token.
 */
export function logout() {
  localStorage.removeItem("token");
}

export async function deleteModel(id: string) {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/models/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
