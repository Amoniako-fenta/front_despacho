import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import PropTypes from "prop-types";

import {
  API_DESPACHOS_URL,
  API_VENTAS_URL,
} from "../../config/api";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      despachado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    const jsonDataSales = {
      despachoGenerado: true,
    };

    try {
      console.log("Actualizando venta...");
      console.log(`${API_VENTAS_URL}/${venta.idVenta}`);

      await axios.put(
        `${API_VENTAS_URL}/${venta.idVenta}`,
        jsonDataSales,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Creando despacho...");
      console.log(API_DESPACHOS_URL);

      await axios.post(API_DESPACHOS_URL, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      });

      await Swal.fire({
        title: "Despacho registrado",
        text: "El despacho fue generado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      onClose();
    } catch (error) {
      console.error(error);

      let mensaje =
        "No fue posible registrar el despacho.";

      if (error.response) {
        mensaje += `\nServidor respondió ${error.response.status}`;
      } else if (error.request) {
        mensaje +=
          "\nNo hubo respuesta del backend.";
      } else {
        mensaje += `\n${error.message}`;
      }

      Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center text-center px-24 text-xl"
    >
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
        Ingreso de orden de despacho
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">
          Fecha de despacho
        </label>

        <input
          type="date"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("fechaDespacho", {
            required: true,
          })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">
          Patente de camión
        </label>

        <input
          type="text"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("patenteCamion", {
            required: true,
          })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">
          Orden de compra
        </label>

        <input
          disabled
          value={venta.idVenta}
          className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">
          Dirección
        </label>

        <input
          disabled
          value={venta.direccionCompra}
          className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">
          Valor compra
        </label>

        <input
          disabled
          value={venta.valorCompra}
          className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
        />
      </div>

      <button
        type="submit"
        className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14"
      >
        Asignar despacho
      </button>
    </form>
  );
}

FormDespacho.propTypes = {
  venta: PropTypes.shape({
    idVenta: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    direccionCompra: PropTypes.string,
    valorCompra: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};