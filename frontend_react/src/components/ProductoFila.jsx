import React from "react";

const ProductoFila = ({ producto }) => {
    const { codigo, fecha_entrada_inventario, cantidad_pedida_total, cantidad_vendida, cantidad_disponible, precio_total, total_ganancias } = producto;

    return (
        <div className="producto-fila">
            <div>{codigo}</div>
            <div>{fecha_entrada_inventario}</div>
            <div>{cantidad_pedida_total}</div>
            <div>{cantidad_vendida}</div>
            <div>{cantidad_disponible}</div>
            <div>{precio_total}</div>
            <div>{total_ganancias}</div>
        </div>
    );
};

export default ProductoFila;
