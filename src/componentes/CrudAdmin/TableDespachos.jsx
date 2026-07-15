import { useEffect, useState } from "react";
import axios from "axios";

import { API_DESPACHOS_URL } from "../../config/api";
import { FormCierreDespacho } from "./FormCierreDespacho";
import { Modal } from "./Modal";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const cargarDespachos = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await axios.get(API_DESPACHOS_URL, {
        headers: {
          Accept: "application/json",
        },
        timeout: 10000,
      });

      const despachosRecibidos = Array.isArray(response.data)
        ? response.data
        : [];

      console.log("Despachos recibidos:", despachosRecibidos);
      setDespachos(despachosRecibidos);
    } catch (errorSolicitud) {
      console.error("Error al obtener los despachos:", errorSolicitud);

      if (errorSolicitud.code === "ECONNABORTED") {
        setError("El backend de despachos tardó demasiado en responder.");
      } else if (errorSolicitud.response) {
        setError(
          `El backend respondió con el código ${errorSolicitud.response.status}.`
        );
      } else {
        setError(
          "No fue posible conectar con el backend de despachos. Revisa la IP, el puerto, CORS y el Security Group."
        );
      }

      setDespachos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  const handleCerrarModal = () => {
    setOpenModal(false);
    setDespachoSeleccionado(null);
  };

  const handleDespachoActualizado = async () => {
    handleCerrarModal();
    await cargarDespachos();
  };

  return (
    <>
      <section className="grid grid-cols-12 mb-8 text-center">
        <div className="col-span-12 flex justify-center">
          <div className="w-full max-w-7xl p-4 bg-white border border-gray-200 rounded-lg shadow overflow-x-auto">
            {cargando && (
              <p className="py-8 text-gray-600">
                Cargando despachos...
              </p>
            )}

            {!cargando && error && (
              <div className="py-8">
                <p className="mb-4 font-semibold text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={cargarDespachos}
                  className="px-6 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!cargando && !error && despachos.length === 0 && (
              <p className="py-8 text-gray-600">
                No existen despachos registrados.
              </p>
            )}

            {!cargando && !error && despachos.length > 0 && (
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-3 py-3">Orden de despacho</th>
                    <th className="px-3 py-3">Orden de compra</th>
                    <th className="px-3 py-3">Dirección</th>
                    <th className="px-3 py-3">Fecha</th>
                    <th className="px-3 py-3">Patente</th>
                    <th className="px-3 py-3">Estado</th>
                    <th className="px-3 py-3">Intentos</th>
                    <th className="px-3 py-3">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {despachos.map((despacho) => (
                    <tr
                      key={despacho.idDespacho}
                      className="border-t border-gray-200"
                    >
                      <td className="px-3 py-6">
                        {despacho.idDespacho}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.idCompra}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.direccionCompra}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.fechaDespacho}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.patenteCamion}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.despachado
                          ? "Despacho entregado"
                          : "Despacho pendiente"}
                      </td>

                      <td className="px-3 py-6">
                        {despacho.intento}
                      </td>

                      <td className="px-3 py-6">
                        <button
                          type="button"
                          onClick={() => handleAbrirModal(despacho)}
                          className="px-8 py-2 bg-orange-200 rounded-xl shadow-md hover:bg-orange-300/70"
                        >
                          Cerrar despacho
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <Modal open={openModal} onClose={handleCerrarModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={handleDespachoActualizado}
          />
        )}
      </Modal>
    </>
  );
};