// Función para convertir expresiones tipo x^n y funciones matemáticas a su equivalente en JavaScript
function convertirExpresion(expresion) {
    expresion = expresion.replace(/\^/g, '**');  // Manejo de potencias con **
    expresion = expresion.replace(/cos\(/g, 'Math.cos(');
    expresion = expresion.replace(/sin\(/g, 'Math.sin(');
    expresion = expresion.replace(/tan\(/g, 'Math.tan(');
    expresion = expresion.replace(/asin\(/g, 'Math.asin(');
    expresion = expresion.replace(/acos\(/g, 'Math.acos(');
    expresion = expresion.replace(/atan\(/g, 'Math.atan(');
    expresion = expresion.replace(/log10\(/g, 'Math.log10(');
    expresion = expresion.replace(/log\(/g, 'Math.log(');
    expresion = expresion.replace(/exp\(/g, 'Math.exp(');
    expresion = expresion.replace(/sqrt\(/g, 'Math.sqrt(');
    expresion = expresion.replace(/abs\(/g, 'Math.abs(');
    expresion = expresion.replace(/round\(/g, 'Math.round(');
    expresion = expresion.replace(/floor\(/g, 'Math.floor(');
    expresion = expresion.replace(/ceil\(/g, 'Math.ceil(');
    return expresion;
}

// Función para formatear números
function formatearNumero(numero) {
    if (Number.isInteger(numero)) {
        return numero.toString();  // Devuelve el número como cadena si es entero
    } else {
        return numero.toFixed(6);  // Limita a 6 decimales si no es entero
    }
}

document.getElementById('newtonForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Evita que la página se recargue

    // Obtención de los valores del formulario
    let funcion = document.getElementById('funcion').value;
    const x0 = parseFloat(document.getElementById('inicial').value);
    const tolerancia = parseFloat(document.getElementById('tolerancia').value);

    // Convertir las expresiones de potencias y funciones matemáticas
    funcion = convertirExpresion(funcion);

    // Convertir la cadena en función usando Function en vez de eval
    const f = new Function('x', `return ${funcion};`);
    
    // Calcular la derivada numéricamente usando diferencias centradas
    const df = (x) => (f(x + 1e-5) - f(x - 1e-5)) / (2e-5);

    // Implementación del Método de Newton-Raphson
    function newtonRaphson(f, x0, tolerancia) {
        let xi = x0;
        let iteraciones = [];
        let errorRelativo = null;

        for (let i = 0; i < 50; i++) {
            const fxi = f(xi);
            iteraciones.push({ iteracion: i, xi, fxi });

            const xiAnterior = xi;
            const dfxi = df(xi);
            
            if (Math.abs(dfxi) < 1e-10) {
                return { raiz: xi, iteraciones, error: "Derivada cero, no se puede continuar." };
            }

            xi = xi - fxi / dfxi;

            // Calcular el error relativo
            if (i > 0) {
                errorRelativo = Math.abs((xiAnterior - xi) / xi);
                iteraciones[i - 1].errorRelativo = errorRelativo; // Almacenar el error relativo
            } else {
                iteraciones[i].errorRelativo = null; // Para la primera iteración
            }

            // Criterio de convergencia: tanto f(xi) como el cambio en xi deben ser pequeños
            if (Math.abs(fxi) < tolerancia && Math.abs(xi - xiAnterior) < tolerancia) {
                break;
            }
        }
        
        return { raiz: xi, iteraciones };
    }

    // Calcular y mostrar el resultado
    const resultado = newtonRaphson(f, x0, tolerancia);

    // Mostrar la raíz aproximada
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `Raíz aproximada: ${formatearNumero(resultado.raiz)}`;

    // Mostrar la tabla de iteraciones
    const tablaBody = document.querySelector('#iteracionesTabla tbody');
    tablaBody.innerHTML = '';  // Limpiar la tabla anterior
    resultado.iteraciones.forEach((fila) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fila.iteracion}</td>
            <td>${formatearNumero(fila.xi)}</td>
            <td>${formatearNumero(fila.fxi)}</td>
            <td>${fila.errorRelativo !== undefined ? formatearNumero(fila.errorRelativo) : ''}</td>
        `;
        tablaBody.appendChild(tr);
    });

    // Mostrar la tabla 
    document.getElementById('iteracionesTabla').style.display = 'table';
});

document.getElementById('borrar').addEventListener('click', function() {
    // Limpiar los campos del formulario
    document.getElementById('newtonForm').reset();
    document.getElementById('tolerancia').value = '';

    // Limpiar la tabla de iteraciones
    const tablaBody = document.querySelector('#iteracionesTabla tbody');
    tablaBody.innerHTML = '';

    // Ocultar la tabla
    const tabla = document.getElementById('iteracionesTabla');
    tabla.style.display = 'none';

    // Limpiar el contenido de la raíz aproximada (div#resultado)
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpiar el contenido

    // Ocultar los títulos si existen
    const tituloIteraciones = document.querySelector('h3#tituloIteraciones');
    const tituloGrafico = document.querySelector('h3#tituloGrafico');

    if (tituloIteraciones) tituloIteraciones.style.display = 'none';
    if (tituloGrafico) tituloGrafico.style.display = 'none';
});
