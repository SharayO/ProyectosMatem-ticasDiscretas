function clearInput() {
    // Limpiar la tabla de verdad
    document.querySelector("#truthTable tbody").innerHTML = '';

    // Restablecer los valores seleccionados de A y B a sus valores predeterminados
    document.getElementById('varA').value = '0';
    document.getElementById('varB').value = '0';

    // Opcional: Limpiar la operación seleccionada
    const selectedOperationElement = document.getElementById('selectedOperation');
    selectedOperationElement.textContent = 'Selecciona una operación:';
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.buttons button[data-operation]');
    const generateTableButton = document.getElementById('generateTable');
    const clearButton = document.getElementById('clearButton');
    const selectedOperationElement = document.getElementById('selectedOperation');
    const truthTableBody = document.querySelector("#truthTable tbody");

    function booleanAnd(a, b) { return a && b; }
    function booleanOr(a, b) { return a || b; }
    function booleanXor(a, b) { return (a || b) && !(a && b); }
    function booleanNot(a) { return a === 0 ? 1 : 0; }
    function booleanImplication(a, b) { return a === 0 || b === 1; }
    function booleanBiconditional(a, b) { return a === b; }

    function formatBoolean(value) {
        return value ? 1 : 0;
    }

    function updateTruthTable(operation) {
        truthTableBody.innerHTML = ''; // Limpiar tabla

        const values = [
            { A: 0, B: 0 },
            { A: 0, B: 1 },
            { A: 1, B: 0 },
            { A: 1, B: 1 }
        ];

        values.forEach(pair => {
            const row = document.createElement("tr");
            const aCell = document.createElement("td");
            const bCell = document.createElement("td");
            const resultCell = document.createElement("td");

            aCell.textContent = pair.A;
            bCell.textContent = pair.B;

            let result;
            switch (operation) {
                case 'and':
                    result = formatBoolean(booleanAnd(pair.A, pair.B));
                    break;
                case 'or':
                    result = formatBoolean(booleanOr(pair.A, pair.B));
                    break;
                case 'xor':
                    result = formatBoolean(booleanXor(pair.A, pair.B));
                    break;
                case 'notA':
                    result = formatBoolean(booleanNot(pair.A));
                    break;
                case 'notB':
                    result = formatBoolean(booleanNot(pair.B));
                    break;
                case 'implication':
                    result = formatBoolean(booleanImplication(pair.A, pair.B));
                    break;
                case 'biconditional':
                    result = formatBoolean(booleanBiconditional(pair.A, pair.B));
                    break;
                default:
                    result = 'Error';
            }

            resultCell.textContent = result;
            row.appendChild(aCell);
            row.appendChild(bCell);
            row.appendChild(resultCell);
            truthTableBody.appendChild(row);
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedOperationElement.textContent = `Operación: ${this.textContent}`;
        });
    });

    generateTableButton.addEventListener('click', function() {
        const operation = document.querySelector('.buttons button[data-operation].active')?.getAttribute('data-operation');
        if (!operation) return;

        updateTruthTable(operation);
    });

});
