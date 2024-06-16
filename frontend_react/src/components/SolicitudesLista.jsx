import { useEffect, useState } from "react";
import { getAllSolicitudes } from "../api/solicitudes.api";

export function SolicitudesLista(){
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(()=>{

        async function cargarSolicitudes() {
            const respuesta = await getAllSolicitudes();
            setSolicitudes(respuesta.data);
        }
        cargarSolicitudes();
    }, []);



    return <div>
        {solicitudes.map(solicitud => (
            <div key={solicitud.id}>
                <h1>{solicitud.codigo}</h1>
            </div>
        ))}
    </div>;

}