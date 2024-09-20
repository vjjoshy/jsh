document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

document.getElementById('data-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const name = document.getElementById('name').value;
    const numberOfWorkers = document.getElementById('number-of-workers').value;
    const activity = document.getElementById('activity').value;

    const tableBody = document.querySelector('#data-table tbody');
    let rowUpdated = false;

    // Iterate over existing rows to find if the combination exists
    tableBody.querySelectorAll('tr').forEach(row => {
        const rowDate = row.cells[0].textContent;
        const rowLocation = row.cells[1].textContent;
        const rowForemanName = row.cells[2].textContent;

        if (rowDate === date && rowLocation === location) {
            if (rowForemanName === name) {
                // Update the existing row
                row.cells[3].textContent = numberOfWorkers;
                row.cells[4].textContent = activity;
                rowUpdated = true;
            }
        }
    });

    if (!rowUpdated) {
        // Create a new table row if no existing row was updated
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${location}</td>
            <td>${name}</td>
            <td>${numberOfWorkers}</td>
            <td>${activity}</td>
        `;
        tableBody.appendChild(row);
    }

    // Save data to local storage
    saveData();

    // Clear the form
    document.getElementById('data-form').reset();
});

document.getElementById('generate-summary').addEventListener('click', function() {
    const tableBody = document.querySelector('#data-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    const summary = {};
    const foremanMap = {}; // To track the number of foremen per date and location
    let totalManpower = 0;
    let totalWorkers = 0;

    rows.forEach(row => {
        const date = row.cells[0].textContent;
        const location = row.cells[1].textContent;
        const foremanName = row.cells[2].textContent;
        const numberOfWorkers = parseInt(row.cells[3].textContent, 10);

        if (!summary[date]) {
            summary[date] = {};
            foremanMap[date] = {};
        }

        if (!summary[date][location]) {
            summary[date][location] = {
                foremen: new Set(),
                totalWorkers: 0
            };
            foremanMap[date][location] = new Set();
        }

        summary[date][location].foremen.add(foremanName);
        summary[date][location].totalWorkers += numberOfWorkers;
        foremanMap[date][location].add(foremanName);

        totalManpower += numberOfWorkers + 1; // 1 for the foreman
        totalWorkers += numberOfWorkers;
    });

    let summaryText = '';
    let extractedSummaryText = '';

    for (const date in summary) {
        for (const location in summary[date]) {
            const data = summary[date][location];
            const foremanCount = data.foremen.size;

            extractedSummaryText += `Date: ${date}\n`;
            extractedSummaryText += `Location: ${location}\n`;
            extractedSummaryText += `Total Manpower: ${data.totalWorkers + foremanCount}\n`;
            extractedSummaryText += `Total Workers: ${data.totalWorkers}\n`;
            extractedSummaryText += `Total Foremen: ${foremanCount}\n\n`;

            summaryText += `Date: ${date}\n`;
            summaryText += `Location: ${location}\n`;

            // Detailed data for each foreman
            data.foremen.forEach(foreman => {
                summaryText += `  Foreman: ${foreman}\n`;
                const foremanRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => {
                    return row.cells[0].textContent === date &&
                           row.cells[1].textContent === location &&
                           row.cells[2].textContent === foreman;
                });
                foremanRows.forEach(row => {
                    summaryText += `    Number of Workers: ${row.cells[3].textContent}\n`;
                    summaryText += `    Activity: ${row.cells[4].textContent}\n`;
                });
            });
            summaryText += `  Total Number of Workers: ${data.totalWorkers}\n\n`;
        }
    }

    document.getElementById('summary-output').textContent = 'Extracted Data:\n' + extractedSummaryText + 'Detailed Data:\n' + summaryText;
});

document.getElementById('download-summary').addEventListener('click', function() {
    const tableBody = document.querySelector('#data-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    const csvRows = [];
    csvRows.push(['Date', 'Location', 'Foreman Name', 'Number of Workers', 'Activity'].join(','));

    rows.forEach(row => {
        const cells = Array.from(row.cells).map(cell => `"${cell.textContent}"`);
        csvRows.push(cells.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daily_summary.csv';
    link.click();
});

function saveData() {
    const tableBody = document.querySelector('#data-table tbody');
    const rows = tableBody.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
        const cells = Array.from(row.cells).map(cell => cell.textContent);
        data.push(cells);
    });

    localStorage.setItem('tableData', JSON.stringify(data));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('tableData'));
    if (data) {
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }
}
