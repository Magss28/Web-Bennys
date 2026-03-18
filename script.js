/**
 * Variable global para que el Full Tuning se sume y no se borre
 */
let acumuladoFullTuning = 0;

/**
 * Función para abrir y cerrar el menú lateral (Sidebar)
 */
function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let main = document.getElementById("main");

    // Ajuste de ancho para el desplazamiento lateral
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

/**
 * Función principal de cálculo
 */
function calcular() {
    let vistaHabitual = document.getElementById("habitual");
    let vistaCompleta = document.getElementById("completo");
    
    // Verificamos cuál está activa mediante la clase CSS definida en el style.css
    if (!vistaHabitual.classList.contains("seccion-activa") && 
        !vistaCompleta.classList.contains("seccion-activa")) return;

    let contenedor = vistaHabitual.classList.contains("seccion-activa") ? vistaHabitual : vistaCompleta;
    let filas = contenedor.querySelectorAll("tbody tr");
    let totalPiezas = 0;

    // 1. Recorrer la tabla de piezas
    filas.forEach((fila) => {
        let input = fila.querySelector("input");
        if(!input) return;

        let cantidad = Math.max(0, parseInt(input.value) || 0);
        input.value = cantidad; 

        let precioTexto = fila.cells[3].innerText;
        let precio = parseInt(precioTexto.replace(/\D/g, ""));
        
        let totalFila = cantidad * precio;
        fila.cells[4].innerText = "$" + totalFila.toLocaleString();
        
        totalPiezas += totalFila;
    });

    // 2. Sumar el acumulador de Full Tuning
    let montoFinal = totalPiezas + acumuladoFullTuning;

    // 3. Actualizar los bloques de la derecha (Monto Total)
    contenedor.querySelectorAll(".monto-total").forEach(span => {
        span.innerText = montoFinal.toLocaleString();
    });

    // 4. Actualizar tabla de descuentos
    let tablaDescuento = contenedor.querySelector(".tabla-descuento");
    if (tablaDescuento) {
        let filasDesc = tablaDescuento.querySelectorAll("tbody tr");
        let porcentajes = [0.05, 0.10, 0.15]; 

        filasDesc.forEach((fila, index) => {
            fila.cells[0].innerText = "$" + montoFinal.toLocaleString();
            let montoDescontado = montoFinal * porcentajes[index];
            let resultadoFinal = montoFinal - montoDescontado;
            fila.cells[2].innerText = "$" + Math.round(resultadoFinal).toLocaleString();
        });
    }
}

/**
 * Función para aplicar el bono de Full Tuning
 */
function aplicarFullTuning() {
    acumuladoFullTuning += 120000;
    calcular();
}

/**
 * Copiar monto al portapapeles sin puntos ni símbolos
 */
function copiarTotal() {
    let habitual = document.getElementById("habitual");
    let contenedor = habitual.classList.contains("seccion-activa") ? habitual : document.getElementById("completo");
    let totalTexto = contenedor.querySelector(".monto-total").innerText;
    let soloNumero = totalTexto.replace(/\./g, ""); 
    navigator.clipboard.writeText(soloNumero);
}

/**
 * Reiniciar todos los inputs y el acumulador
 */
function reiniciar() {
    document.querySelectorAll("input").forEach(i => i.value = 0);
    acumuladoFullTuning = 0;
    calcular();
}

/**
 * Lógica de navegación entre vistas usando clases CSS
 */
function ocultarTodas() {
    document.getElementById("habitual").classList.remove("seccion-activa");
    document.getElementById("completo").classList.remove("seccion-activa");
    document.getElementById("vista-info").classList.remove("seccion-activa");
}

function mostrarHabitual() {
    ocultarTodas();
    document.getElementById("habitual").classList.add("seccion-activa");
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

function mostrarCompleto() {
    ocultarTodas();
    document.getElementById("completo").classList.add("seccion-activa");
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

function mostrarInfo() {
    ocultarTodas();
    document.getElementById("vista-info").classList.add("seccion-activa");
    document.getElementById("titulo-principal").style.display = "none";
}

/**
 * Al cargar la página, inicializamos la vista deseada
 */
window.onload = function() {
    // Iniciamos en la vista completa por defecto
    mostrarCompleto();
};