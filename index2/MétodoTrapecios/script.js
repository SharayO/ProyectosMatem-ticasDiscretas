// Función para evaluar la expresión en x
function evaluarFuncion(funcion, x) {
    return math.evaluate(funcion, { x });
}

// Método de trapecios con fórmula precisa
function metodoTrapecios(funcion, a, b, n) {
    const h = (b - a) / n;
    let suma = 0;

    // Suma los puntos interiores
    for (let i = 1; i < n; i++) {
        let xi = a + i * h;
        suma += evaluarFuncion(funcion, xi);
    }

    // Calcula la integral aproximada usando la fórmula del trapecio compuesto
    let integral = (h / 2) * (evaluarFuncion(funcion, a) + 2 * suma + evaluarFuncion(funcion, b));
    return integral;
}

// Función para calcular el error usando la fórmula del trapecio
function calcularError(funcion, a, b, n) {
    const h = (b - a) / n;

    // Derivada segunda de la función
    const segundaDerivada = math.derivative(math.derivative(funcion, 'x'), 'x');

    // Evaluar la segunda derivada en a y b
    const f2_a = segundaDerivada.evaluate({ x: a });
    const f2_b = segundaDerivada.evaluate({ x: b });

    // Tomamos el valor máximo de la derivada segunda entre a y b
    const f2_max = Math.max(Math.abs(f2_a), Math.abs(f2_b));

    // Cálculo del error
    const error = -((h ** 3) / 12) * f2_max;

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

    const resultado = metodoTrapecios(funcion, a, b, n);
    const error = calcularError(funcion, a, b, n);

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
    // Aquí puedes agregar el código para mostrar la gráfica
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
    // Opcional: ocultar la gráfica si es necesario
    document.getElementById("grafico").style.display = "none";
}
