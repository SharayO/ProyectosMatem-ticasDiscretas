function generatePointsInputs() {
    const numPoints = parseInt(document.getElementById("numPoints").value);
    const pointsTable = document.getElementById("pointsTable");
    pointsTable.innerHTML = "";

    for (let i = 0; i < numPoints; i++) {
        const xInput = document.createElement("input");
        xInput.type = "number";
        xInput.placeholder = `x${i + 1}`;

        const yInput = document.createElement("input");
        yInput.type = "number";
        yInput.placeholder = `y${i + 1}`;

        pointsTable.appendChild(xInput);
        pointsTable.appendChild(yInput);
    }
}

document.getElementById("numPoints").addEventListener("input", generatePointsInputs);

function calculate() {
    const numPoints = parseInt(document.getElementById("numPoints").value);
    const pointsTable = document.getElementById("pointsTable");
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < numPoints; i++) {
        const x = parseFloat(pointsTable.children[i * 2].value);
        const y = parseFloat(pointsTable.children[i * 2 + 1].value);

        if (isNaN(x) || isNaN(y)) {
            alert("Por favor, ingrese todos los valores de puntos.");
            return;
        }

        xValues.push(x);
        yValues.push(y);
    }

    const results = [];
    for (let degree = 1; degree <= 6; degree++) {
        const result = calculatePolynomialFit(xValues, yValues, degree);
        if (result) {
            results.push(result);
        } else {
            results.push("Error");
        }
    }

    results.forEach((result, i) => {
        document.getElementById(`grade${i + 1}`).value = result;
    });
}

function clearFields() {
    document.getElementById("numPoints").value = 2;
    document.getElementById("pointsTable").innerHTML = "";
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`grade${i}`).value = "";
    }
}

function calculatePolynomialFit(x, y, degree) {
    const n = x.length;
    const A = [];

    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j <= degree; j++) {
            row.push(Math.pow(x[i], j));
        }
        A.push(row);
    }

    const B = y.slice();

    try {
        const coefficients = solveLeastSquares(A, B);
        return coefficients.map((coef, i) => `a${i}=${coef.toFixed(10)}`).join(", ");
    } catch (error) {
        console.error("Error en la resolución del sistema: ", error);
        return null;
    }
}

function solveLeastSquares(A, B) {
    const At = math.transpose(A);
    const AtA = math.multiply(At, A);
    const AtB = math.multiply(At, B);

    return math.lusolve(AtA, AtB).flat();
}
