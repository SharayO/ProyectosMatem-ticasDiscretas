// script.js

// Función para calcular la integral usando el método de Monte Carlo
function calcular() {
    const funcion = document.getElementById("funcion").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const n = parseInt(document.getElementById("n").value);
    
    if (!funcion || isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        alert("Por favor, rellena todos los campos correctamente.");
        return;
    }

    let suma = 0;
    for (let i = 0; i < n; i++) {
        const x = Math.random() * (b - a) + a;
        try {
            const f_x = eval(funcion.replace(/x/g, x));
            suma += f_x;
        } catch (error) {
            alert("Error en la función f(x). Asegúrate de usar una sintaxis válida.");
            return;
        }
    }

    const resultado = ((b - a) / n) * suma;
    document.getElementById("puntosContados").innerText = n;
    document.getElementById("resultado").innerText = resultado.toFixed(6);
}

// Función para limpiar los campos de entrada y salida
function borrar() {
    document.getElementById("funcion").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("n").value = "";
    document.getElementById("puntosContados").innerText = "";
    document.getElementById("resultado").innerText = "";
}

// Función para cerrar la calculadora
function salir() {
    window.close();
}