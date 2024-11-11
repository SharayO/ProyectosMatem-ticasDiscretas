function appendFunction(value) {
    document.getElementById('function-input').value += value;
}

function deleteLastChar() {
    const inputField = document.getElementById('function-input');
    inputField.value = inputField.value.slice(0, -1);
}

function clearInput() {
    document.getElementById('function-input').value = ''; // Limpiar la entrada
    document.getElementById('value-input').value = ''; // Limpiar el valor de x
    document.getElementById('result').textContent = 'Resultado: '; // Limpiar el resultado
}

function evaluateFunction() {
    const func = document.getElementById('function-input').value;
    const x = parseFloat(document.getElementById('value-input').value);
    
    if (func === '' || isNaN(x)) {
        alert('Por favor, ingrese una función y un valor para x.');
        return;
    }

    try {
        // Preparar la función para evaluar en grados o radianes dependiendo del caso
        let result;
        
        if (func.includes('sin') || func.includes('cos') || func.includes('tan')) {
            // Convertir x a radianes si la función es trigonométrica
            const radianValue = math.unit(x, 'deg').toNumber('rad');
            const parsedFunction = math.compile(func);
            result = parsedFunction.evaluate({ x: radianValue });
        } else {
            // Evaluar normalmente para otras funciones
            const parsedFunction = math.compile(func);
            result = parsedFunction.evaluate({ x: x });
        }

        // Redondear el resultado y mostrar valores enteros como enteros
        const threshold = 1e-10; // Umbral para considerar valores cercanos a cero como 0
        const roundedResult = Math.abs(result) < threshold ? 0 : parseFloat(result.toFixed(10));

        // Mostrar el resultado sin decimales si es entero
        const finalResult = Number.isInteger(roundedResult) ? roundedResult.toString() : roundedResult.toString();

        document.getElementById('result').textContent = `Resultado: ${finalResult}`;
    } catch (error) {
        console.error('Error al evaluar la función:', error);
        alert('Error al evaluar la función. Por favor, revise la función ingresada.');
    }
}














