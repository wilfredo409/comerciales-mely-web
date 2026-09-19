import { apiRequest } from "./apiClient";

export const reportesService = {
  resumen: () => apiRequest("/api/reportes/resumen"),
};
