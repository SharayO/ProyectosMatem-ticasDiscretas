// Función para evaluar la expresión en un valor específico de x
function evaluarFuncion(expr, x) {
    try {
        return math.evaluate(expr, { x: x });
    } catch (error) {
        throw new Error('Error al evaluar la función. Verifique la expresión ingresada.');
    }
}

// Función para calcular el error relativo
function calcularErrorRelativo(actual, previo) {
    return Math.abs((actual - previo) / actual);
}

// Método de Bisección
function biseccion(funcion, a, b, tolerancia) {
    let iteraciones = 0;
    const MAX_ITERACIONES = 100;
    let resultados = [];
    let f_a = evaluarFuncion(funcion, a);
    let f_b = evaluarFuncion(funcion, b);

    if (f_a * f_b > 0) {
        return { error: "No hay cambio de signo en los límites a y b" };
    }

    let anteriorRaiz = null;
    while ((b - a) / 2 > tolerancia && iteraciones < MAX_ITERACIONES) {
        iteraciones++;
        let medio = (a + b) / 2;
        let f_medio = evaluarFuncion(funcion, medio);
        resultados.push({ iteracion: iteraciones, a: a, b: b, medio: medio, f_a: f_a, f_b: f_b, f_medio: f_medio });

        if (anteriorRaiz !== null) {
            let errorRelativo = calcularErrorRelativo(medio, anteriorRaiz);
            resultados[resultados.length - 1].errorRelativo = errorRelativo;
        }

        if (f_medio === 0 || Math.abs(f_medio) < tolerancia) {
            break;
        } else if (f_a * f_medio < 0) { // Actualizar el extremo superior
            b = medio;
            f_b = f_medio;
        } else if (f_b * f_medio < 0){ // Actualizar el extremo inferior
            a = medio;
            f_a = f_medio;
        }

        anteriorRaiz = medio;
    }

    return {
        raiz: (a + b) / 2,
        precision: (b - a) / 2,
        iteraciones: iteraciones,
        resultados: resultados
    };
}

// Método de Regla Falsa
function reglaFalsa(funcion, a, b, tolerancia) {
    let iteraciones = 0;
    const MAX_ITERACIONES = 100;
    let resultados = [];
    let f_a = evaluarFuncion(funcion, a);
    let f_b = evaluarFuncion(funcion, b);

    if (f_a * f_b > 0) {
        return { error: "No hay cambio de signo en los límites a y b" };
    }

    let anteriorRaiz = null;
    while (iteraciones < MAX_ITERACIONES) {
        iteraciones++;
        let r = (a * f_b - b * f_a) / (f_b - f_a);
        let f_r = evaluarFuncion(funcion, r);
        resultados.push({ iteracion: iteraciones, a: a, b: b, r: r, f_a: f_a, f_b: f_b, f_r: f_r });

        if (anteriorRaiz !== null) {
            let errorRelativo = calcularErrorRelativo(r, anteriorRaiz);
            resultados[resultados.length - 1].errorRelativo = errorRelativo;
        }

        if (f_r === 0 || Math.abs(f_r) < tolerancia) {
            break;
        } else if (f_r * f_b < 0) { // Actualizar el extremo inferior
            a = r;
            f_a = f_r;
        } else if (f_r * f_a < 0) { // Actualizar el extremo superior
            b = r;
            f_b = f_r;
        }

        anteriorRaiz = r;
    }

    return {
        raiz: (a * f_b - b * f_a) / (f_b - f_a),
        precision: Math.abs(b - a),
        iteraciones: iteraciones,
        resultados: resultados
    };
}

document.getElementById('biseccionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const funcion = document.getElementById('funcion').value;
    const a = parseFloat(document.getElementById('limiteInferior').value);
    const b = parseFloat(document.getElementById('limiteSuperior').value);
    const tolerancia = parseFloat(document.getElementById('tolerancia').value);

    if (!funcion || isNaN(a) || isNaN(b) || isNaN(tolerancia)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        let resultBiseccion = biseccion(funcion, a, b, tolerancia);
        let resultReglaFalsa = reglaFalsa(funcion, a, b, tolerancia);

        // Crear el contenido de resultados para la pestaña
        let resultadosHTML = `
        <h2>Resultados del Método de Bisección</h2>
        <table>
            <tr>
                <th>Iteración<br><i>n</i></th>
                <th>Extremo Inferior<br><i>a</i></th>
                <th>Imagen Ext. Inf.<br><i>f(a)</i></th>
                <th>Extremo Superior<br><i>b</i></th>
                <th>Imagen Ext. Sup.<br><i>f(b)</i></th>
                <th>Raíz<br><i>r<sub>n</sub></i></th>
                <th>Imagen raíz<br><i>f(r<sub>n</sub>)</i></th>
                <th>Error relativo<br><i>ε<sub>r</sub></i></th>
            </tr>`;

        resultBiseccion.resultados.forEach(res => {
            resultadosHTML += `
            <tr>
                <td>${res.iteracion}</td>
                <td>${res.a.toFixed(6)}</td>
                <td>${res.f_a.toFixed(6)}</td>
                <td>${res.b.toFixed(6)}</td>
                <td>${res.f_b.toFixed(6)}</td>
                <td>${res.medio.toFixed(6)}</td>
                <td>${res.f_medio.toFixed(6)}</td>
                <td>${res.errorRelativo ? res.errorRelativo.toFixed(6) : '-'}</td>
            </tr>`;
        });

        resultadosHTML += `</table>
        <h2>Resultados del Método de Regla Falsa</h2>
        <table>
            <tr>
                <th>Iteración<br><i>n</i></th>
                <th>Extremo Inferior<br><i>a</i></th>
                <th>Imagen Ext. Inf.<br><i>f(a)</i></th>
                <th>Extremo Superior<br><i>b</i></th>
                <th>Imagen Ext. Sup.<br><i>f(b)</i></th>
                <th>Raíz<br><i>r<sub>n</sub></i></th>
                <th>Imagen raíz<br><i>f(r<sub>n</sub>)</i></th>
                <th>Error relativo<br><i>ε<sub>r</sub></i></th>
            </tr>`;

        resultReglaFalsa.resultados.forEach(res => {
            resultadosHTML += `
            <tr>
                <td>${res.iteracion}</td>
                <td>${res.a.toFixed(6)}</td>
                <td>${res.f_a.toFixed(6)}</td>
                <td>${res.b.toFixed(6)}</td>
                <td>${res.f_b.toFixed(6)}</td>
                <td>${res.r.toFixed(6)}</td>
                <td>${res.f_r.toFixed(6)}</td>
                <td>${res.errorRelativo ? res.errorRelativo.toFixed(6) : '-'}</td>
            </tr>`;
        });

        resultadosHTML += `</table>`;

        // Abrir una nueva pestaña para mostrar los resultados
        const newTab = window.open();
        newTab.document.write(`
            <html>
            <head>
                <title>Resultados</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h2 { color: #f5684c; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ed401d; padding: 8px; text-align: center; }
                    th { background-color: #f5684c; color: white; }
                </style>
            </head>
            <body>
                ${resultadosHTML}
            </body>
            </html>
        `);
        newTab.document.close();

    } catch (error) {
        alert(error.message);
    }
});
