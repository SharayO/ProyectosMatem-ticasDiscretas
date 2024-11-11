document.getElementById('calcular').addEventListener('click', function() {
    const funcStr = document.getElementById('funcion').value;
    let x0 = parseFloat(document.getElementById('x0').value);
    let x1 = parseFloat(document.getElementById('x1').value);
    const tolerancia = parseFloat(document.getElementById('tolerancia').value);
    const resultadoBody = document.getElementById('resultado-body');
    resultadoBody.innerHTML = '';  // Limpiar resultados previos

    // Reemplaza ^ por ** para que eval funcione correctamente
    const f = (x) => eval(funcStr.replace(/x/g, x).replace(/\^/g, '**'));
    let error = 1;  // Inicializar el error como 1 para empezar el bucle
    let iteracion = 1;

    // Evaluar la función en x0 y x1
    let f_x0 = f(x0);
    let f_x1 = f(x1);

    // Comprobar que no estamos dividiendo por cero
    if (f_x1 === f_x0) {
        alert('Error: f(x0) y f(x1) son iguales. Ajuste los valores iniciales.');
        return;
    }

    // Inicializar el valor anterior de x
    let x_anterior = x1;

    while (error > tolerancia) {
        // Fórmula del método de la secante
        let x_r2 = x1 - (f_x1 * (x1 - x0)) / (f_x1 - f_x0);  

        // Calcular el error relativo
        error = Math.abs((x_r2 - x_anterior) / x_r2);

        // Crear fila para la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${iteracion}</td>
            <td>${x_r2.toFixed(5)}</td>
            <td>${f(x_r2).toFixed(5)}</td>
            <td>${error.toFixed(5)}</td> <!-- Mostrar el error relativo aquí -->
        `;
        resultadoBody.appendChild(row);

        // Actualizar valores para la siguiente iteración
        x0 = x1;
        x1 = x_r2;
        
        // Evaluar nuevamente la función en el nuevo x1
        f_x0 = f_x1;
        f_x1 = f(x1);
        
        // Actualizar el valor anterior de x
        x_anterior = x_r2; // Cambiado para usar el último valor calculado

        // Comprobar nuevamente por división por cero
        if (f_x1 === f_x0) {
            alert('Error: f(x0) y f(x1) son iguales. Ajuste los valores iniciales.');
            return;
        }

        iteracion++;
    }

    // Mostrar la raíz aproximada en el HTML
    document.getElementById('resultado-raiz').innerHTML = `Raíz aproximada: ${x1.toFixed(6)}`;
    // Mostrar los títulos y la tabla
    document.getElementById('resultado-titulo').style.display = 'block';
    document.getElementById('resultado-raiz').style.display = 'block';
    document.getElementById('resultado-tabla').style.display = 'table';
});

// Función para borrar los resultados y limpiar entradas
document.getElementById('borrar').addEventListener('click', function() {
    // Limpiar los resultados
    document.getElementById('resultado-body').innerHTML = '';
    document.getElementById('resultado-raiz').innerHTML = '';
    
    // Limpiar las entradas del usuario
    document.getElementById('funcion').value = '';
    document.getElementById('x0').value = '';
    document.getElementById('x1').value = '';
    document.getElementById('tolerancia').value = '';
    
    // Ocultar la tabla y la raíz
    document.getElementById('resultado-titulo').style.display = 'none';
    document.getElementById('resultado-raiz').style.display = 'none';
    document.getElementById('resultado-tabla').style.display = 'none';
});
