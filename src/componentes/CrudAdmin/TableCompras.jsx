import { useEffect, useState } from "react";
import axios from "axios";

import { API_VENTAS_URL } from "../../config/api";
import { FormDespacho } from "./FormDespacho";
import { Modal } from "./Modal";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const obtenerCompras = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await axios.get(API_VENTAS_URL, {
        headers: {
          Accept: "application/json",
        },
        timeout: 10000,
      });

      const ventasRecibidas = Array.isArray(response.data)
        ? response.data
        : [];

      console.log("Ventas recibidas:", ventasRecibidas);
      setVentas(ventasRecibidas);
    } catch (errorSolicitud) {
      console.error("Error al obtener las ventas:", errorSolicitud);

      if (errorSolicitud.code === "ECONNABORTED") {
        setError("El servidor de ventas tardó demasiado en responder.");
      } else if (errorSolicitud.response) {
        setError(
          `El servidor respondió con error ${errorSolicitud.response.status}.`
        );
      } else {
        setError(
          "No fue posible conectar con el backend de ventas. Revisa la URL, el puerto y el Security Group."
        );
      }

      setVentas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  const handleCerrarModal = () => {
    setOpenModal(false);
    setVentaSeleccionada(null);
  };

  const handleDespachoCreado = async () => {
    handleCerrarModal();
    await obtenerCompras();
  };

  const ventasPendientes = ventas.filter(
    (venta) => !venta.despachoGenerado
  );

  return (
    <>
      <section className="grid grid-cols-12 mb-8 text-center">
        <div className="col-span-12 flex justify-center">
          <div className="w-full max-w-6xl p-4 bg-white border border-gray-200 rounded-lg shadow overflow-x-auto">
            {cargando && (
              <p className="py-8 text-gray-600">
                Cargando órdenes de compra...
              </p>
            )}

            {!cargando && error && (
              <div className="py-8">
                <p className="mb-4 text-red-600 font-semibold">{error}</p>

                <button
                  type="button"
                  onClick={obtenerCompras}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!cargando && !error && ventasPendientes.length === 0 && (
              <p className="py-8 text-gray-600">
                No existen órdenes de compra pendientes de despacho.
              </p>
            )}

            {!cargando && !error && ventasPendientes.length > 0 && (
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-3">Orden de compra</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Fecha de compra</th>
                    <th className="px-4 py-3">Valor total</th>
                    <th className="px-4 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ventasPendientes.map((venta) => (
                    <tr
                      key={venta.idVenta}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-6">{venta.idVenta}</td>

                      <td className="px-4 py-6">
                        {venta.direccionCompra}
                      </td>

                      <td className="px-4 py-6">{venta.fechaCompra}</td>

                      <td className="px-4 py-6">
                        ${Number(venta.valorCompra ?? 0).toLocaleString("es-CL")}
                      </td>

                      <td className="px-4 py-6">
                        <button
                          type="button"
                          onClick={() => handleAbrirModal(venta)}
                          className="px-8 py-2 bg-orange-200 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                        >
                          Generar despacho
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
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={handleDespachoCreado}
          />
        )}
      </Modal>
    </>
  );
};