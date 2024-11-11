let chart; // Variable global para almacenar el gráfico

function appendFunction(value) {
    document.getElementById('function-input').value += value;
}

function deleteLastChar() {
    const inputField = document.getElementById('function-input');
    inputField.value = inputField.value.slice(0, -1);
}

function clearInput() {
    document.getElementById('function-input').value = ''; // Limpiar la entrada
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    if (chart) {
        chart.destroy(); // Destruir el gráfico existente
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar el área del gráfico
}

function generateGraph() {
    const funcInput = document.getElementById('function-input').value;
    if (funcInput === '') {
        alert('Por favor, ingrese al menos una función.');
        return;
    }

    const functions = funcInput.split(',').map(f => f.trim()); // Dividir las funciones por comas
    const xValues = [];
    const datasets = functions.map(func => {
        const parsedFunction = math.compile(func);
        const yValues = [];

        for (let x = -10; x <= 10; x += 0.1) {
            const scope = { x: x };
            const y = parsedFunction.evaluate(scope);
            yValues.push(y);
            xValues.push(x);
        }

        return {
            label: `f(x) = ${func}`,
            data: xValues.map((x, index) => ({ x, y: yValues[index] })),
            borderColor: getRandomColor(), // Cambia el color de la línea para cada función
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
        };
    });

    const ctx = document.getElementById('graphCanvas').getContext('2d');

    // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
    if (chart) {
        chart.destroy();
    }

    // Crear nuevos datos para la gráfica
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -10,
                    max: 10,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5],
                    },
                    ticks: {
                        color: '#000',
                        font: {
                            size: 12,
                        },
                    },
                    title: {
                        display: true,
                        text: 'x',
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
                y: {
                    min: -10,
                    max: 10,
                    grid: {
                        display: true,
                        color: 'rgba(200, 200, 200, 0.5)',
                        borderDash: [5, 5],
                    },
                    ticks: {
                        color: '#000',
                        font: {
                            size: 12,
                        },
                    },
                    title: {
                        display: true,
                        text: 'f(x)',
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
            },
        },
    });
}

// Función para generar un color aleatorio
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
