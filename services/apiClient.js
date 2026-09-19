// Cliente HTTP delgado sobre fetch. Centraliza el manejo de errores y el
// envío de cookies de sesión (credentials: "include") para toda la app.
export async function apiRequest(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin cuerpo (p. ej. 204)
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Error ${res.status} al procesar la solicitud.`);
  }
  return data;
}
