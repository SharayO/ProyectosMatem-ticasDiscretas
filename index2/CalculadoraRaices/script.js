// Función para convertir las expresiones de formato natural a formato JavaScript
function parseExpression(expr) {
    return expr
        .replace(/π/g, 'Math.PI')         
        .replace(/e\^\(([^)]+)\)/g, 'Math.exp($1)') // Casos como e^(x)
        .replace(/e\^(\d+(\.\d+)?)/g, 'Math.exp($1)') // Casos como e^x o e^2
        .replace(/ln/g, 'Math.log')       
        .replace(/\^/g, '')             
        .replace(/cos/g, 'Math.cos')      
        .replace(/sin/g, 'Math.sin')      
        .replace(/tan/g, 'Math.tan');     
}

// Manejar el envío del formulario
document.getElementById("rootForm").onsubmit = async function(event) {
    event.preventDefault();

    let funcStr = document.getElementById("functionInput").value;
    let derivativeStr = document.getElementById("derivativeInput").value;
    let initialGuess1 = parseFloat(document.getElementById("initialGuess1").value);
    let initialGuess2 = parseFloat(document.getElementById("initialGuess2").value);
    let resultDiv = document.getElementById("result");

    let parsedFunc = parseExpression(funcStr);
    let parsedDerivative = parseExpression(derivativeStr);

    try {
        // Definir las funciones matemáticas usando new Function
        let f = new Function('x', 'return ' + parsedFunc);
        let df = new Function('x', 'return ' + parsedDerivative);

        // Implementar el método de Newton-Raphson
        function newtonRaphson(guess, tolerance = 1e-6, maxIterations = 100) {
            let x = guess;
            for (let i = 0; i < maxIterations; i++) {
                let fx = f(x);
                let dfx = df(x);

                if (Math.abs(dfx) < 1e-10) {
                    throw new Error("La derivada es demasiado pequeña en x = " + x);
                }

                let x_next = x - fx / dfx;

                if (Math.abs(x_next - x) < tolerance) {
                    return x_next;
                }
                x = x_next;
            }
            throw new Error("El método no converge en " + maxIterations + " iteraciones.");
        }

        // Calcular las raíces
        let root1 = newtonRaphson(initialGuess1);
        let root2 = newtonRaphson(initialGuess2);

        // Mostrar el resultado en formato MathJax
        if (root1 !== null && root2 !== null) {
            resultDiv.innerHTML = `
                \\[
                    \\text{Raíz negativa}: x_1 = ${root1.toFixed(5)} \\\\
                    \\text{Raíz positiva}: x_2 = ${root2.toFixed(5)}
                \\]
            `;
            await MathJax.typesetPromise();
        } else {
            resultDiv.innerHTML = "No se encontraron las raíces. Prueba con otras aproximaciones.";
        }

    } catch (error) {
        console.error("Error al evaluar las funciones: ", error);
        resultDiv.innerHTML = "Hubo un error al evaluar las funciones. Revisa la sintaxis.";
    }
}