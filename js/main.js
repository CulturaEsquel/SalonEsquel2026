document.addEventListener('DOMContentLoaded', () => {
    // Cargamos ambos JSON en paralelo
    Promise.all([
        fetch('premios-especiales.json').then(res => res.json()),
        fetch('secciones.json').then(res => res.json())
    ])
    .then(([premiosData, seccionesData]) => {
        
        // --- 1. RENDERIZAR PREMIOS ESPECIALES ---
        const gp = premiosData.gran_premio_honor;
        if (gp && document.getElementById('contenedor-premio-honor')) {
            document.getElementById('contenedor-premio-honor').innerHTML = `
                <div class="obra-destacada">
                    <a href="img/${gp.id_archivo}.jpg" data-lightbox="honor" data-title="${gp.titulo} - ${gp.autor}">
                        <img src="img/${gp.id_archivo}.jpg" alt="${gp.titulo}">
                    </a>
                    <h3>${gp.titulo}</h3>
                    <p><strong>Autor:</strong> ${gp.autor} (${gp.localidad})</p>
                    <p>${gp.reseña}</p>
                </div>
            `;
        }

        const pal = premiosData.premio_autor_local;
        if (pal && document.getElementById('contenedor-autor-local')) {
            document.getElementById('contenedor-autor-local').innerHTML = `
                <div class="obra-destacada">
                    <a href="img/${pal.id_archivo}.jpg" data-lightbox="local" data-title="${pal.titulo} - ${pal.autor}">
                        <img src="img/${pal.id_archivo}.jpg" alt="${pal.titulo}">
                    </a>
                    <h3>${pal.titulo}</h3>
                    <p><strong>Autor:</strong> ${pal.autor} (${pal.localidad})</p>
                </div>
            `;
        }

        // --- 2. RENDERIZAR LAS 4 SECCIONES DEL SALÓN ---
        // Accedemos a 'seccionesData.secciones' debido a la estructura de tu archivo
        const sec = seccionesData.secciones;

        renderizarSeccion('pintura', sec.pintura);
        renderizarSeccion('dibujo', sec.dibujo);
        renderizarSeccion('grabado', sec.grabado_arte_impreso);
        renderizarSeccion('escultura', sec.escultura_relieve);
    })
    .catch(error => console.error('Error al cargar los datos del catálogo:', error));
});

// Función genérica para pintar cada sección de obras
function renderizarSeccion(nombreId, dataSeccion) {
    const contenedor = document.getElementById(`contenedor-${nombreId}`);
    if (!contenedor || !dataSeccion) return;

    let htmlContenido = '';

    // 1. Renderizar Premios (con un diseño destacado)
    if (dataSeccion.premios && dataSeccion.premios.length > 0) {
        htmlContenido += `<div class="subseccion-titulo"><h3>Premios y Menciones</h3></div>`;
        htmlContenido += `<div class="galeria galeria-premios">`;
        
        dataSeccion.premios.forEach(obra => {
            const urlImagen = `img/${obra.id_archivo}.jpg`;
            htmlContenido += `
                <div class="obra-card premio-card">
                    <span class="badge-premio">Premiado / Mención</span>
                    <a href="${urlImagen}" data-lightbox="${nombreId}-premios" data-title="${obra.titulo} - ${obra.autor}">
                        <img src="${urlImagen}" alt="${obra.titulo}" loading="lazy">
                    </a>
                    <h3>${obra.titulo}</h3>
                    <p><strong>Autor:</strong> ${obra.autor}</p>
                    <p><em>${obra.localidad}</em></p>
                </div>
            `;
        });
        htmlContenido += `</div>`;
    }

    // 2. Renderizar Obras Seleccionadas (con el diseño normal de grilla)
    if (dataSeccion.seleccionadas && dataSeccion.seleccionadas.length > 0) {
        htmlContenido += `<div class="subseccion-titulo"><h3>Obras Seleccionadas</h3></div>`;
        htmlContenido += `<div class="galeria">`;
        
        dataSeccion.seleccionadas.forEach(obra => {
            const urlImagen = `img/${obra.id_archivo}.jpg`;
            htmlContenido += `
                <div class="obra-card">
                    <a href="${urlImagen}" data-lightbox="${nombreId}-seleccionadas" data-title="${obra.titulo} - ${obra.autor}">
                        <img src="${urlImagen}" alt="${obra.titulo}" loading="lazy">
                    </a>
                    <h3>${obra.titulo}</h3>
                    <p><strong>Autor:</strong> ${obra.autor}</p>
                    <p><em>${obra.localidad}</em></p>
                </div>
            `;
        });
        htmlContenido += `</div>`;
    }

    contenedor.innerHTML = htmlContenido;
}
