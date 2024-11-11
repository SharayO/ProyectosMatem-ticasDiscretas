// Funciones principales
document.getElementById('generateMatrices').addEventListener('click', generateMatrices);
document.getElementById('clearAll').addEventListener('click', clearAll);
document.getElementById('calculateCustomOperation').addEventListener('click', calculateCustomOperation);

// Generar matrices
function generateMatrices() {
    const matrixInputs = document.getElementById('matrixInputs');
    matrixInputs.innerHTML = '';

    const numMatrices = parseInt(document.getElementById('numMatrices').value);
    const matrixSize = parseInt(document.getElementById('matrixSize').value);

    for (let i = 0; i < numMatrices; i++) {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix-container';

        // Añadir título y controles
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'matrix-controls';
        controlsDiv.innerHTML = `
            <h3>Matriz ${String.fromCharCode(65 + i)}</h3>
            <div class="matrix-buttons">
                <button onclick="calculateForMatrix(${i}, 'determinant')">Determinante</button>
                <button onclick="calculateForMatrix(${i}, 'inverse')">Inversa</button>
                <button onclick="calculateForMatrix(${i}, 'transpose')">Transpuesta</button>
                <button onclick="calculateForMatrix(${i}, 'diagonal')">Diagonal</button>
                <button onclick="calculateForMatrix(${i}, 'lu')">Factorización LU</button>
                <button onclick="calculateForMatrix(${i}, 'power')">Potencia</button>
                <button onclick="calculateForMatrix(${i}, 'gaussJordan')">Gauss-Jordan</button>
            </div>
        `;
        matrixDiv.appendChild(controlsDiv);

        // Crear tabla para la matriz
        const table = document.createElement('table');
        table.className = 'matrix-grid';

        for (let row = 0; row < matrixSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < matrixSize; col++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.className = 'matrix-cell';
                input.dataset.matrix = i;
                input.dataset.row = row;
                input.dataset.col = col;
                td.appendChild(input);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        matrixDiv.appendChild(table);
        matrixInputs.appendChild(matrixDiv);
    }

    // Añadir controles de operaciones entre matrices si hay más de una
    if (numMatrices > 1) {
        const operationsDiv = document.createElement('div');
        operationsDiv.className = 'matrix-operations';
        operationsDiv.innerHTML = `
            <h3>Operaciones entre matrices</h3>
            <div class="operations-buttons">
                <button onclick="calculateMatrixOperation('multiply')">A × B</button>
                <button onclick="calculateMatrixOperation('add')">A + B</button>
                <button onclick="calculateMatrixOperation('subtract')">A - B</button>
            </div>
        `;
        document.querySelector('.operations').appendChild(operationsDiv);
    }

    // Mostrar el contenedor de operación personalizada
    document.getElementById('customOperationContainer').style.display = 'block';
}


// Función para calcular operaciones personalizadas
function calculateCustomOperation() {
    const operationString = document.getElementById('customOperation').value;
    const regex = /(-?\d*\.?\d*)?\s*([A-Z])\s*([\+\-\*\/])\s*(-?\d*\.?\d*)?\s*([A-Z])/;
    const matches = operationString.match(regex);

    if (matches) {
        const coeffA = parseFloat(matches[1]) || 1;
        const matrixAIndex = matches[2].charCodeAt(0) - 65; // Convertir 'A' a índice
        const operator = matches[3];
        const coeffB = parseFloat(matches[4]) || 1;
        const matrixBIndex = matches[5].charCodeAt(0) - 65; // Convertir 'B' a índice

        const matrixA = getMatrix(matrixAIndex, parseInt(document.getElementById('matrixSize').value));
        const matrixB = getMatrix(matrixBIndex, parseInt(document.getElementById('matrixSize').value));
        
        let result;

        switch (operator) {
            case '+':
                result = matrixA.map((row, i) => row.map((val, j) => coeffA * val + coeffB * matrixB[i][j]));
                showResult(`${coeffA}A + ${coeffB}B`, result);
                break;
            case '-':
                result = matrixA.map((row, i) => row.map((val, j) => coeffA * val - coeffB * matrixB[i][j]));
                showResult(`${coeffA}A - ${coeffB}B`, result);
                break;
            case '*':
                result = multiplyMatrices(matrixA, matrixB.map(row => row.map(val => coeffB * val)));
                showResult(`${coeffA}A × ${coeffB}B`, result);
                break;
            default:
                alert('Operación no válida');
        }
    } else {
        alert('Formato de operación no válido. Usa, por ejemplo, "2A + 3B".');
    }
}


// Función para calcular operaciones en una matriz específica
function calculateForMatrix(matrixIndex, operation) {
    const matrixSize = parseInt(document.getElementById('matrixSize').value);
    const matrix = getMatrix(matrixIndex, matrixSize);
    const steps = [];

    let result;
    let title;

    switch (operation) {
        case 'determinant':
            result = calculateDeterminantValue(matrix);
            title = `Determinante de Matriz ${String.fromCharCode(65 + matrixIndex)} = ${result}`;
            break;
        case 'inverse':
            result = calculateInverseMatrix(matrix);
            title = `Matriz ${String.fromCharCode(65 + matrixIndex)} Inversa`;
            break;
        case 'transpose':
            result = transposeMatrix(matrix);
            title = `Matriz ${String.fromCharCode(65 + matrixIndex)} Transpuesta`;
            break;
        case 'diagonal':
            result = matrix.map((row, i) => row.map((val, j) => i === j ? val : 0));
            title = `Matriz ${String.fromCharCode(65 + matrixIndex)} Diagonal`;
            break;
        case 'lu':
            const luResult = calculateLUDecomposition(matrix);
            showResult('Factorización LU', [
                ['Matriz L:', luResult.L],
                ['Matriz U:', luResult.U]
            ], steps);
            return;
        case 'power':
            const power = parseInt(prompt("Ingrese el exponente:", "2")) || 2;
            result = matrixPower(matrix, power);
            title = `Matriz ${String.fromCharCode(65 + matrixIndex)} elevada a la ${power}`;
            break;
        case 'gaussJordan':
            result = calculateGaussJordanForMatrix(matrix, steps);
            title = `Matriz ${String.fromCharCode(65 + matrixIndex)} - Gauss-Jordan`;
            break;
    }

    if (result === null) {
        showResult("Error: La operación no puede ser realizada (por ejemplo, matriz no invertible)");
    } else {
        showResult(title, result, steps);
    }
}

// Función para operaciones entre matrices
function calculateMatrixOperation(operation) {
    const matrixSize = parseInt(document.getElementById('matrixSize').value);
    const matrixA = getMatrix(0, matrixSize);
    const matrixB = getMatrix(1, matrixSize);
    const steps = [];

    let result;
    let title;

    switch (operation) {
        case 'multiply':
            result = multiplyMatrices(matrixA, matrixB);
            title = "A × B";
            break;
        case 'add':
            result = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
            title = "A + B";
            break;
        case 'subtract':
            result = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
            title = "A - B";
            break;
    }

    showResult(title, result, steps);
}

// Obtener matriz del DOM
function getMatrix(matrixIndex, matrixSize) {
    const matrix = [];
    for (let row = 0; row < matrixSize; row++) {
        const rowArray = [];
        for (let col = 0; col < matrixSize; col++) {
            const input = document.querySelector(`input[data-matrix="${matrixIndex}"][data-row="${row}"][data-col="${col}"]`);
            rowArray.push(Number(input.value) || 0);
        }
        matrix.push(rowArray);
    }
    return matrix;
}

// Limpiar todo
function clearAll() {
    document.querySelectorAll('.matrix-cell').forEach(cell => cell.value = '');
    document.getElementById('matrixInputs').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('steps').innerHTML = '';
    
    // Limpiar operaciones entre matrices
    const operationsDiv = document.querySelector('.matrix-operations');
    if (operationsDiv) {
        operationsDiv.remove();
    }

}

// Mostrar resultado
function showResult(title, matrix = null, steps = []) {
    const resultDiv = document.getElementById('result');
    const stepsDiv = document.getElementById('steps');
    
    if (steps.length > 0) {
        stepsDiv.innerHTML = '<h3>Pasos:</h3>' + steps.map(step => 
            `<div class="step">${step}</div>`).join('');
    }

    let resultHTML = `<h3>${title}</h3>`;
    if (matrix) {
        if (Array.isArray(matrix) && Array.isArray(matrix[0]) && matrix[0].length !== undefined) {
            // Es una matriz
            resultHTML += '<table class="result-matrix">';
            matrix.forEach(row => {
                resultHTML += '<tr>';
                row.forEach(cell => {
                    resultHTML += `<td>${typeof cell === 'number' ? cell.toFixed(4) : cell}</td>`;
                });
                resultHTML += '</tr>';
            });
            resultHTML += '</table>';
        } else if (Array.isArray(matrix) && matrix[0] instanceof Array && matrix[0][0] instanceof Array) {
            // Es un array de matrices (como en LU)
            matrix.forEach(([title, mat]) => {
                resultHTML += `<h4>${title}</h4>`;
                resultHTML += '<table class="result-matrix">';
                mat.forEach(row => {
                    resultHTML += '<tr>';
                    row.forEach(cell => {
                        resultHTML += `<td>${typeof cell === 'number' ? cell.toFixed(4) : cell}</td>`;
                    });
                    resultHTML += '</tr>';
                });
                resultHTML += '</table>';
            });
        }
    }
    resultDiv.innerHTML = resultHTML;
}

// Funciones auxiliares
function getCofactorMatrix(matrix, row, col) {
    return matrix
        .filter((_, index) => index !== row)
        .map(row => row.filter((_, index) => index !== col));
}

// Calcular determinante
function calculateDeterminantValue(matrix) {
    if (matrix.length !== matrix[0].length) return null; // Solo para matrices cuadradas
    const n = matrix.length;

    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let determinant = 0;
    for (let col = 0; col < n; col++) {
        const cofactor = ((col % 2 === 0) ? 1 : -1) * matrix[0][col] * calculateDeterminantValue(getCofactorMatrix(matrix, 0, col));
        determinant += cofactor;
    }
    return determinant;
}

// Calcular matriz inversa
function calculateInverseMatrix(matrix) {
    const determinant = calculateDeterminantValue(matrix);
    if (determinant === 0) return null;

    const n = matrix.length;
    const adjugate = [];
    for (let i = 0; i < n; i++) {
        const adjugateRow = [];
        for (let j = 0; j < n; j++) {
            const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * calculateDeterminantValue(getCofactorMatrix(matrix, i, j));
            adjugateRow.push(cofactor);
        }
        adjugate.push(adjugateRow);
    }

    const inverse = adjugate.map(row => row.map(val => val / determinant));
    return inverse;
}

// Transponer matriz
function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Potenciar matriz
function matrixPower(matrix, power) {
    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = multiplyMatrices(result, matrix);
    }
    return result;
}

// Multiplicar matrices
function multiplyMatrices(A, B) {
    const result = A.map(row => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

// Factorización LU (para completar el ejemplo)
function calculateLUDecomposition(matrix) {
    const n = matrix.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (j < i) {
                L[j][i] = 0;
            } else {
                U[i][j] = matrix[i][j];
                for (let k = 0; k < i; k++) {
                    U[i][j] -= L[i][k] * U[k][j];
                }
            }
        }
        L[i][i] = 1;
        for (let j = i + 1; j < n; j++) {
            L[j][i] = matrix[j][i];
            for (let k = 0; k < i; k++) {
                L[j][i] -= L[j][k] * U[k][i];
            }
            L[j][i] /= U[i][i];
        }
    }
    return { L, U };
}

function calculateGaussJordanForMatrix(matrix, steps) {
    const n = matrix.length;
    const m = matrix[0].length;
    let augmentedMatrix = matrix.map(row => [...row]);

    for (let i = 0; i < n; i++) {
        // Encuentra el máximo para la columna
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
                maxRow = k;
            }
        }

        // Intercambia la fila actual con la fila del máximo
        if (maxRow !== i) {
            const temp = augmentedMatrix[maxRow];
            augmentedMatrix[maxRow] = augmentedMatrix[i];
            augmentedMatrix[i] = temp;
            steps.push(`Intercambio de fila ${i + 1} con fila ${maxRow + 1}: ${JSON.stringify(augmentedMatrix)}`);
        }

        // Hacer ceros en la columna debajo y encima del pivote
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
                steps.push(`Restando ${factor.toFixed(4)} veces la fila ${i + 1} a la fila ${k + 1}`);
                for (let j = 0; j < m; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
                steps.push(`Resultado tras hacer ceros en la fila ${k + 1}: ${JSON.stringify(augmentedMatrix)}`);
            }
        }

        // Normalizar fila para hacer el pivote igual a 1
        const factor = augmentedMatrix[i][i];
        for (let j = 0; j < m; j++) {
            augmentedMatrix[i][j] /= factor;
        }
        steps.push(`Normalización de la fila ${i + 1}: ${JSON.stringify(augmentedMatrix)}`);
    }

    return augmentedMatrix;
}

