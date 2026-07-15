const ventasUrl = import.meta.env.VITE_API_VENTAS_URL;
const despachosUrl = import.meta.env.VITE_API_DESPACHOS_URL;

if (!ventasUrl) {
  console.warn(
    "No se encontró VITE_API_VENTAS_URL. Se utilizará la ruta local."
  );
}

if (!despachosUrl) {
  console.warn(
    "No se encontró VITE_API_DESPACHOS_URL. Se utilizará la ruta local."
  );
}

export const API_VENTAS_URL =
  ventasUrl || "/api/v1/ventas";

export const API_DESPACHOS_URL =
  despachosUrl || "/api/v1/despachos";