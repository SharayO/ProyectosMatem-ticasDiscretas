function insertSymbol(symbol) {
    document.getElementById('formula').value += symbol;
}

function clearInput() {
    document.getElementById('formula').value = ''; // Limpia la expresión lógica
    document.getElementById('truth-table').innerHTML = ''; // Limpia la tabla de verdad
    document.querySelector('.variable-filters').innerHTML = ''; // Limpia los filtros
    document.querySelector('.variable-filters').style.display = 'none'; // Oculta los filtros
    document.querySelector('.btn-filter').style.display = 'none'; // Oculta el botón de filtro si lo tienes
}

function deleteLast() {
    let formula = document.getElementById('formula').value;
    document.getElementById('formula').value = formula.substring(0, formula.length - 1);
}

function evaluateFormula(formula, values) {
    formula = formula.replace(/∧/g, '&&')
                     .replace(/∨/g, '||')
                     .replace(/¬/g, '!')
                     .replace(/→/g, '|| !')
                     .replace(/↔/g, '===');

    for (let key in values) {
        formula = formula.replace(new RegExp('\\b' + key + '\\b', 'g'), values[key] === 'V');
    }

    try {
        return new Function('return ' + formula)();
    } catch (e) {
        console.error('Error al evaluar la fórmula:', e);
        return false;
    }
}

function generateTruthTable() {
    let formula = document.getElementById('formula').value;
    let variables = [...new Set(formula.match(/[p-t]/g))];
    let rows = Math.pow(2, variables.length);
    let tableHTML = '<table class="show"><tr>';

    // Añadir encabezados para las variables
    variables.forEach(variable => tableHTML += '<th>' + variable + '</th>');

    // Añadir encabezado para la expresión lógica
    tableHTML += '<th>' + formula + '</th></tr>';

    let tableContainer = document.getElementById('truth-table');
    tableContainer.innerHTML = tableHTML;

    let filterContainer = document.querySelector('.variable-filters');
    filterContainer.innerHTML = '';

    variables.forEach(variable => {
        let filterHTML = `
            <label for="filter-${variable}">${variable}:</label>
            <select id="filter-${variable}">
                <option value="all">Todos</option>
                <option value="V">Verdadero</option>
                <option value="F">Falso</option>
            </select>
        `;
        filterContainer.innerHTML += filterHTML;
    });

    filterContainer.style.display = 'block';

    for (let i = 0; i < rows; i++) {
        let values = {};
        let tableRow = '<tr>';

        variables.forEach((variable, index) => {
            let value = (i >> (variables.length - index - 1)) & 1 ? 'V' : 'F';
            values[variable] = value;
            tableRow += '<td>' + value + '</td>';
        });

        let result = evaluateFormula(formula, values);
        let resultValue = result ? 'V' : 'F';
        tableRow += '<td>' + resultValue + '</td></tr>';

        tableHTML += tableRow;
    }

    tableContainer.innerHTML = tableHTML;

    document.querySelectorAll('.variable-filters select').forEach(select => {
        select.addEventListener('change', applyFilter);
    });
}





function applyFilter() {
    let variables = [...new Set(document.getElementById('formula').value.match(/[p-t]/g))];
    let variableFilters = {};

    variables.forEach(variable => {
        let filterValue = document.getElementById(`filter-${variable}`).value;
        variableFilters[variable] = filterValue;
    });

    let rows = document.querySelectorAll('#truth-table tr');

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        let cells = row.querySelectorAll('td');
        let rowMatchesFilters = true;

        for (let variable in variableFilters) {
            let filterValue = variableFilters[variable];
            let cell = row.querySelector(`td:nth-child(${variables.indexOf(variable) + 1})`).textContent;
            if (filterValue !== 'all' && filterValue !== cell) {
                rowMatchesFilters = false;
                break;
            }
        }

        row.style.display = rowMatchesFilters ? '' : 'none';
    });
}





















