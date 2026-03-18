/**
 * Variable global para el acumulado del Full Tuning
 */
let acumuladoFullTuning = 0;

/**
 * Control del Menú Lateral (Sidebar)
 */
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

/**
 * Lógica de Navegación: Ocultar todas las secciones antes de mostrar la elegida
 */
function ocultarTodas() {
    const secciones = ["habitual", "completo", "vista-info"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.classList.remove("seccion-activa");
        }
    });
}

/**
 * Mostrar Vista Habitual
 */
function mostrarHabitual() {
    ocultarTodas();
    const el = document.getElementById("habitual");
    if (el) {
        el.style.display = "block";
        el.classList.add("seccion-activa");
    }
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

/**
 * Mostrar Vista Completa
 */
function mostrarCompleto() {
    ocultarTodas();
    const el = document.getElementById("completo");
    if (el) {
        el.style.display = "block";
        el.classList.add("seccion-activa");
    }
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

/**
 * Mostrar Vista de Información / Normativa
 */
function mostrarInfo() {
    ocultarTodas();
    const el = document.getElementById("vista-info");
    if (el) {
        el.style.display = "block";
    }
    document.getElementById("titulo-principal").style.display = "none";
}

/**
 * Función Principal de Cálculo
 * Lee los inputs de la sección activa y actualiza los totales y descuentos
 */
function calcular() {
    const habitual = document.getElementById("habitual");
    const completo = document.getElementById("completo");
    
    // Identificar qué sección está activa para procesar sus datos
    const contenedor = habitual.classList.contains("seccion-activa") ? habitual : 
                       (completo.classList.contains("seccion-activa") ? completo : null);
    
    if (!contenedor) return;

    let totalPiezas = 0;
    const filas = contenedor.querySelectorAll("tbody tr");

    filas.forEach((fila) => {
        const input = fila.querySelector("input");
        if (!input) return; // Saltar filas de subcategoría

        // Validar que no haya números negativos
        const cantidad = Math.max(0, parseInt(input.value) || 0);
        input.value = cantidad; 

        // Obtener el precio unitario de la cuarta columna (índice 3)
        const precioTexto = fila.cells[3].innerText;
        const precio = parseInt(precioTexto.replace(/\D/g, ""));
        
        // Calcular total por fila y mostrarlo en la quinta columna (índice 4)
        const totalFila = cantidad * precio;
        fila.cells[4].innerText = "$" + totalFila.toLocaleString();
        
        totalPiezas += totalFila;
    });

    // Sumar el acumulado de botones especiales (como Full Tuning)
    const montoFinal = totalPiezas + acumuladoFullTuning;

    // Actualizar todos los SPAN de monto-total en la vista activa
    contenedor.querySelectorAll(".monto-total").forEach(span => {
        span.innerText = montoFinal.toLocaleString();
    });

    // Actualizar la tabla de descuentos (5%, 10%, 15%)
    const tablaDesc = contenedor.querySelector(".tabla-descuento");
    if (tablaDesc) {
        const filasDesc = tablaDesc.querySelectorAll("tbody tr");
        const porcentajes = [0.05, 0.10, 0.15]; 

        filasDesc.forEach((fila, index) => {
            // Columna 0: Monto Total original
            fila.cells[0].innerText = "$" + montoFinal.toLocaleString();
            // Columna 2: Monto con descuento aplicado
            const resultado = montoFinal - (montoFinal * porcentajes[index]);
            fila.cells[2].innerText = "$" + Math.round(resultado).toLocaleString();
        });
    }
}

/**
 * Añadir el coste del Full Tuning al total
 */
function aplicarFullTuning() {
    acumuladoFullTuning += 120000;
    calcular();
}

/**
 * Reiniciar todos los valores a cero
 */
function reiniciar() {
    document.querySelectorAll("input").forEach(i => i.value = 0);
    acumuladoFullTuning = 0;
    calcular();
}

/**
 * Copiar el monto total al portapapeles (solo números)
 */
function copiarTotal() {
    const activo = document.querySelector(".seccion-activa");
    if (!activo) return;
    
    const totalTexto = activo.querySelector(".monto-total").innerText;
    // Eliminar puntos de millares para que sea un número limpio
    const soloNumero = totalTexto.replace(/\./g, ""); 
    
    navigator.clipboard.writeText(soloNumero).then(() => {
        alert("Copiado al portapapeles: $" + soloNumero);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

/**
 * Al cargar la página, inicializar en la Vista Completa
 */
window.onload = function() {
    mostrarCompleto();
};