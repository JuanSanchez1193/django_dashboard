// ventas.api.js
import axios from 'axios';

const URL = process.env.NODE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL : "http://127.0.0.1:8000/";

const ventasApi = axios.create({
  baseURL: `${URL}/ventas/api/`
});

export const buscadorCodigos = (searchTerm) => {
  return ventasApi.get(`/buscar/${searchTerm}/`);
};

export const fetchRazonesCancelacion = async (startDate, endDate) => {
    try {
        const response = await ventasApi.get('/resumen-solicitudes/', {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data.razones_combined_data;
    } catch (error) {
        console.error('Error fetching razones de cancelacion data:', error);
        throw error; 
    }
};

export const fetchSolicitudesCliente = async (clienteId, startDate, endDate) => {
    try {
        const response = await ventasApi.get('/solicitudes-cliente/', {
            params: {
                cliente: clienteId,
                start_date: startDate,
                end_date: endDate,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching solicitudes del cliente:', error);
        throw error; // Opcional: maneja el error de acuerdo a tu aplicación
    }
};

export const fetchSolicitudesProducto = async (productId, startDate, endDate) => {
    try {
        const response = await ventasApi.get('/solicitudes-producto/', {
            params: {
                producto: productId,
                start_date: startDate,
                end_date: endDate,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching solicitudes del producto:', error);
        throw error; // Opcional: maneja el error de acuerdo a tu aplicación
    }
};

export const fetchSolicitudesProveedor = async (proveedorId, startDate, endDate) => {
    try {
        const response = await ventasApi.get('/solicitudes-proveedor/', {
            params: {
                proveedor: proveedorId,
                start_date: startDate,
                end_date: endDate,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching solicitudes del proveedor:', error);
        throw error; // Opcional: maneja el error de acuerdo a tu aplicación
    }
};


export const fetchResumenSolicitudes = async (startDate, endDate) => {
    try {
        const response = await ventasApi.get('/resumen-solicitudes/', {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching resumen de solicitudes:', error);
        throw error; // Opcional: maneja el error de acuerdo a tu aplicación
    }
};

export const fetchTipoCancelacion = async (startDate, endDate) => {
    try {
        const response = await ventasApi.get('/resumen-solicitudes/', {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data.cancelacion_data;
    } catch (error) {
        console.error('Error fetching tipo cancelacion data:', error);
        throw error; // Opcional: maneja el error de acuerdo a tu aplicación
    }
};

export const fetchClientesConDatos = async ({ startDate, endDate, includeWithoutRequests, topOption, otherOption, topX }) => {
    try {
      const response = await ventasApi.get('/clientes-con-datos/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          include_without_requests: includeWithoutRequests,
          top_option: topOption,
          other_option: otherOption,
          top_x: topX
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clientes con datos:', error);
      throw error;
    }
  };

export const fetchProductosConDatos = async ({ startDate, endDate, includeWithoutRequests, topOption, otherOption, topX }) => {
  try {
    const response = await ventasApi.get('/productos-con-datos/', {
      params: {
        start_date: startDate,
        end_date: endDate,
        include_without_requests: includeWithoutRequests,
        top_option: topOption,
        other_option: otherOption,
        top_x: topX
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching productos con datos:', error);
    throw error;
  }
};

export const fetchProveedoresConDatos = async ({ startDate, endDate, includeWithoutRequests, topOption, otherOption, topX }) => {
    try {
      const response = await ventasApi.get('/proveedores-con-datos/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          include_without_requests: includeWithoutRequests,
          top_option: topOption,
          other_option: otherOption,
          top_x: topX
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching proveedores con datos:', error);
      throw error;
    }
  };

  export const fetchSolicitudesConDatos = async ({ startDate, endDate, includeCancelled, topOption, otherOption, topX }) => {
    try {
      const response = await ventasApi.get('/solicitudes-con-datos/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          include_cancelled: includeCancelled,
          top_option: topOption,
          other_option: otherOption,
          top_x: topX
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching solicitudes con datos:', error);
      throw error;
    }
  };