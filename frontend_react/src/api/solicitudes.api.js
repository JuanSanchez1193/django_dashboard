import axios from 'axios'

export const getAllSolicitudes = ()=> {
    return axios.get('http://localhost:8000/ventas/api/solicitudes/')
}