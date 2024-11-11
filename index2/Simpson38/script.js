// Función para evaluar la expresión en x
function evaluarFuncion(funcion, x) {
    try {
        return math.evaluate(funcion, { x });
    } catch (error) {
        alert("Error al evaluar la función. Asegúrate de que esté escrita correctamente.");
        throw error;
    }
}

// Función para calcular la cuarta derivada de la función
function calcularCuartaDerivada(funcion, x) {
    let derivada = funcion;
    for (let i = 0; i < 4; i++) {
        derivada = math.derivative(derivada, 'x');
    }
    return derivada.evaluate({ x });
}

// Método Simpson 3/8 con fórmula precisa
function metodoSimpson38(funcion, a, b, n) {
    if (n % 3 !== 0) {
        alert("El número de intervalos (n) debe ser un múltiplo de 3.");
        return null;
    }
    
    const h = (b - a) / n;
    let sumaMultiploTres = 0;
    let sumaNoMultiploTres = 0;

    // Suma los puntos que no son múltiplos de 3
    for (let i = 1; i < n; i++) {
        let xi = a + i * h;
        if (i % 3 === 0) {
            sumaMultiploTres += evaluarFuncion(funcion, xi);
        } else {
            sumaNoMultiploTres += evaluarFuncion(funcion, xi);
        }
    }

    // Calcula la integral aproximada usando la fórmula de Simpson 3/8
    let integral = (3 * h / 8) * (evaluarFuncion(funcion, a) + 3 * sumaNoMultiploTres + 2 * sumaMultiploTres + evaluarFuncion(funcion, b));
    return integral;
}

// Función para calcular el error usando la fórmula proporcionada
function calcularError(funcion, a, b, h) {
    const puntos = [a, (a + b) / 2, b];
    let maxDerivada4 = Math.max(...puntos.map(p => Math.abs(calcularCuartaDerivada(funcion, p))));

    // Aplicamos la fórmula del error
    let error = -(Math.pow(h, 5) / 80) * maxDerivada4;
    return error;
}

// Función para generar la expresión LaTeX de la integral
function generarFormulaLatex(funcion, a, b) {
    return `\\int_{${a}}^{${b}} ${funcion.replace(/\*/g, "")} \\, dx`;
}

// Función principal
function calcular() {
    const funcion = document.getElementById("funcion").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const n = parseInt(document.getElementById("n").value);

    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    if (n % 3 !== 0) {
        alert("El número de intervalos (n) debe ser un múltiplo de 3 para el Método Simpson 3/8.");
        return;
    }

    try {
        const h = (b - a) / n;
        const resultado = metodoSimpson38(funcion, a, b, n);
        const error = calcularError(funcion, a, b, h);

        if (resultado !== null) {
            // Mostrar resultados y asignar valores
            document.getElementById("resultado").textContent = resultado.toFixed(6);
            document.getElementById("error").textContent = error.toFixed(6);

            // Generar la fórmula LaTeX de la integral
            const formulaLatex = generarFormulaLatex(funcion, a, b);

            // Mostrar la fórmula de la integral usando MathJax
            document.getElementById("integralImagen").innerHTML = `$$${formulaLatex}$$`;
            MathJax.typeset(); // Renderizar la expresión con MathJax

            // Mostrar el contenedor de resultados
            document.getElementById("resultados").style.display = "block";
        }
    } catch (error) {
        console.error("Error en el cálculo:", error);
    }
}

// Función para resetear los campos y resultados
function resetear() {
    document.getElementById("funcion").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("n").value = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("error").textContent = "";
    document.getElementById("integralImagen").innerHTML = "";
    document.getElementById("resultados").style.display = "none";
}
