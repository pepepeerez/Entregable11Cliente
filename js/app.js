const listaProductos = document.getElementById('lista-productos');
const formularioProducto = document.getElementById('formulario-producto');
const nombreProductoInput = document.getElementById('product_name');
const precioProductoInput = document.getElementById('product_price');


async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/product'); 
        const productos = await response.json();

        listaProductos.innerHTML = '';

       
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <span>${producto.name} - $${producto.price}</span>
                <button class="delete-btn" data-id="${producto.id}">Eliminar</button>
            `;
            listaProductos.appendChild(productoDiv);
        });

        document.querySelectorAll('.delete-btn').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }
}

async function eliminarProducto(event) {
    const idProducto = event.target.getAttribute('data-id');
    try {
        await fetch(`http://localhost:8080/api/v1/product/delete/${idProducto}`, {
            method: 'DELETE'
        });
     
        obtenerProductos();
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
    }
}


async function añadirProducto(event) {
    event.preventDefault();

    const nuevoProducto = {
        name: nombreProductoInput.value,
        price: parseFloat(precioProductoInput.value)
    };

    try {
        await fetch('http://localhost:8080/api/v1/product/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        
        nombreProductoInput.value = '';
        precioProductoInput.value = '';

        obtenerProductos();
    } catch (error) {
        console.error('Error al añadir el producto:', error.message);
    }
}

formularioProducto.addEventListener('submit', añadirProducto);


obtenerProductos();