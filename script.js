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
    
    if (vistaHabitual.style.display === "none" && vistaCompleta.style.display === "none") return;

    let contenedor = vistaHabitual.style.display === "block" ? vistaHabitual : vistaCompleta;
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

    // 2. Sumar el acumulador de Full Tuning al total de las piezas
    let montoFinal = totalPiezas + acumuladoFullTuning;

    // 3. Actualizar los bloques de la derecha
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
 * Función que se activa al dar clic en el cabezal del panel Full Tuning
 */
function aplicarFullTuning() {
    acumuladoFullTuning += 120000;
    calcular();
}

/**
 * Copiar monto
 */
function copiarTotal() {
    let vistaHabitual = document.getElementById("habitual");
    let contenedor = (vistaHabitual.style.display === "block") ? vistaHabitual : document.getElementById("completo");
    let totalTexto = contenedor.querySelector(".monto-total").innerText;
    let soloNumero = totalTexto.replace(/\./g, ""); 
    navigator.clipboard.writeText(soloNumero);
}

/**
 * Reiniciar todo
 */
function reiniciar() {
    let contenedores = [document.getElementById("habitual"), document.getElementById("completo")];
    contenedores.forEach(cont => {
        if(cont) cont.querySelectorAll("input").forEach(i => i.value = 0);
    });
    acumuladoFullTuning = 0; // Limpiamos el acumulador
    calcular();
}

function mostrarHabitual() {
    document.getElementById("habitual").style.display = "block";
    document.getElementById("completo").style.display = "none";
    document.getElementById("vista-info").style.display = "none";
    document.querySelector("#main h2").style.display = "block";
    calcular();
}

function mostrarCompleto() {
    document.getElementById("habitual").style.display = "none";
    document.getElementById("completo").style.display = "block";
    document.getElementById("vista-info").style.display = "none";
    document.querySelector("#main h2").style.display = "block";
    calcular();
}

function mostrarInfo() {
    document.getElementById("habitual").style.display = "none";
    document.getElementById("completo").style.display = "none";
    document.getElementById("vista-info").style.display = "block";
    document.querySelector("#main h2").style.display = "none";
}

window.onload = function() {
    calcular();
};