function calcularDerivadas() {
    const funcion = document.getElementById("funcion").value;
    const x0 = parseFloat(document.getElementById("x0").value);
    const tabla = document.getElementById("resultados");
    tabla.innerHTML = ""; // Limpiar tabla de resultados previos
    
    try {
        // Compilar la función ingresada por el usuario
        let f = math.parse(funcion).compile();
        
        // Mostrar la tabla de resultados
        document.getElementById("resultadosTabla").style.display = 'table';
        
        // Evaluar la función original en x0
        let valorFuncion = f.evaluate({ x: x0 });
        let row = document.createElement("tr");
        row.innerHTML = `<td>f(x)</td><td>${valorFuncion}</td>`;
        tabla.appendChild(row);

        // Variable para almacenar la derivada actual
        let derivada = funcion;

        // Calcular hasta la sexta derivada
        for (let i = 1; i <= 6; i++) {
            // Derivar la función en cada paso
            derivada = math.derivative(derivada, 'x');
            
            // Evaluar la derivada en x0
            let valorDerivada = derivada.evaluate({ x: x0 });
            
            // Agregar fila a la tabla con el valor de la derivada evaluada
            let row = document.createElement("tr");
            row.innerHTML = `<td>${i}°</td><td>${valorDerivada}</td>`;
            tabla.appendChild(row);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

function borrarResultados() {
    // Ocultar la tabla y limpiar su contenido
    document.getElementById("resultadosTabla").style.display = 'none';
    document.getElementById("resultados").innerHTML = "";

    // Limpiar los campos de entrada
    document.getElementById("funcion").value = "";
    document.getElementById("x0").value = "";
}
