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
    const func = document.getElementById('function-input').value;
    if (func === '') {
        alert('Por favor, ingrese una función.');
        return;
    }

    // Evaluación de la función para valores negativos y positivos de x
    try {
        const parsedFunction = math.compile(func);
        
        const xValues = [];
        const yValues = [];
        
        for (let x = -10; x <= 10; x += 0.1) {
            const scope = { x: x };
            const y = parsedFunction.evaluate(scope);
            xValues.push(x);
            yValues.push(y);
        }
        
        const ctx = document.getElementById('graphCanvas').getContext('2d');

        // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
        if (chart) {
            chart.destroy();
        }

        // Crear nuevos datos para la gráfica
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: `f(x) = ${func}`,
                    data: xValues.map((x, index) => ({ x, y: yValues[index] })),
                    borderColor: '#074053', // Color de la línea
                    borderWidth: 2, // Grosor de la línea
                    fill: false, // No llenar el área bajo la curva
                    pointRadius: 0, // No mostrar los puntos en la línea
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -10, // Ajusta el límite mínimo del eje x
                        max: 10,  // Ajusta el límite máximo del eje x
                        grid: {
                            display: true, // Mostrar las líneas de la cuadrícula
                            color: 'rgba(0, 0, 0, 0.1)', // Color de las líneas de la cuadrícula
                            borderDash: [5, 5], // Línea punteada
                        },
                        ticks: {
                            color: '#000', // Color de los números del eje x
                            font: {
                                size: 12 // Tamaño de la fuente de los números del eje x
                            }
                        },
                        title: {
                            display: true,
                            text: 'x',
                            color: '#000',
                            font: {
                                size: 14 // Tamaño de la fuente del título del eje x
                            }
                        }
                    },
                    y: {
                        min: -10, // Ajusta el límite mínimo del eje y
                        max: 10,  // Ajusta el límite máximo del eje y
                        grid: {
                            display: true, // Mostrar las líneas de la cuadrícula
                            color: 'rgba(200, 200, 200, 0.5)', // Color de las líneas de la cuadrícula
                            borderDash: [5, 5], // Línea punteada
                        },
                        ticks: {
                            color: '#000', // Color de los números del eje y
                            font: {
                                size: 12 // Tamaño de la fuente de los números del eje y
                            }
                        },
                        title: {
                            display: true,
                            text: 'f(x)',
                            color: '#000',
                            font: {
                                size: 14 // Tamaño de la fuente del título del eje y
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al evaluar la función:', error);
        alert('Error al evaluar la función. Por favor, revise la función ingresada.');
    }
}

function clearGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    if (chart) {
        chart.destroy(); // Destruir el gráfico existente
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar el área del gráfico
}








