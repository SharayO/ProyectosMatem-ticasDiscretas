function clearInputs() {
    // Limpiar campos de entrada
    document.getElementById('inputNumber').value = '';
    document.getElementById('fromBase').selectedIndex = 0;
    
    // Limpiar la tabla y otros resultados
    document.getElementById('conversionTable').innerHTML = '';
}

function convertNumber() {
    const input = document.getElementById('inputNumber').value.trim();
    const fromBase = parseInt(document.getElementById('fromBase').value);

    if (!input) {
        alert('Por favor, ingresa un número.');
        return;
    }

    // Divide el input en parte entera y fraccionaria
    const [integerPart, fractionalPart] = input.split('.');

    const decimalIntegerPart = parseInt(integerPart, fromBase);
    if (isNaN(decimalIntegerPart)) {
        alert('Número no válido para la base seleccionada.');
        return;
    }

    // Convertir la parte fraccionaria a decimal
    let decimalFractionalPart = 0;
    if (fractionalPart) {
        decimalFractionalPart = fractionalPart.split('').reduce((acc, digit, index) => {
            return acc + parseInt(digit, fromBase) * Math.pow(fromBase, -(index + 1));
        }, 0);
    }

    // Obtener el valor decimal total
    const decimalValue = decimalIntegerPart + decimalFractionalPart;

    // Mapeo de bases a sus nombres
    const baseNames = {
        2: 'Binario',
        8: 'Octal',
        10: 'Decimal',
        16: 'Hexadecimal'
    };

    const bases = [2, 8, 10, 16];
    const targetBases = bases.filter(base => base !== fromBase);

    let tableHTML = "<table><tr><th>Base</th><th>Resultado</th></tr>";

    targetBases.forEach(base => {
        let convertedValue = '';

        // Convertir parte entera
        let integerPart = Math.floor(decimalValue);
        while (integerPart > 0) {
            convertedValue = (integerPart % base).toString(base) + convertedValue;
            integerPart = Math.floor(integerPart / base);
        }

        // Convertir parte fraccionaria
        const fractionalPart = decimalValue - Math.floor(decimalValue);
        if (fractionalPart > 0) {
            convertedValue += '.';
            let fraction = fractionalPart;
            for (let i = 0; i < 5; i++) {  // Limitar la precisión a 5 dígitos
                fraction *= base;
                const digit = Math.floor(fraction);
                convertedValue += digit.toString(base);
                fraction -= digit;
                if (fraction === 0) break;
            }
        }

        // Asegurarse de que el valor sea representado en mayúsculas
        tableHTML += `<tr><td>${baseNames[base]}</td><td>${convertedValue.toUpperCase()}</td></tr>`;
    });

    tableHTML += "</table>";

    document.getElementById('conversionTable').innerHTML = tableHTML;
}


document.getElementById('refreshBtn').addEventListener('click', clearInputs);
document.querySelector('.btn').addEventListener('click', convertNumber);



