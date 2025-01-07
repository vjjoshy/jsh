let entries = [];

function addEntry() {
    const textarea = document.createElement('textarea');
    textarea.className = 'inputText';
    textarea.placeholder = 'Paste your manpower details here...';
    document.getElementById('dataEntryContainer').appendChild(textarea);
}

function extractData() {
    const textareas = document.getElementsByClassName('inputText');
    entries = [];
    for (let textarea of textareas) {
        entries.push(textarea.value.trim());
    }
    const extractedData = processEntries(entries);
    const conclusion = "\n\nIn conclusion, the above details outline the manpower distribution across various departments. Each section provides insights into the personnel assigned and activities performed, ensuring a comprehensive overview of the workforce.";
    document.getElementById('output').innerText = extractedData + conclusion;
}

function processEntries(entries) {
    let result = '';
    for (let entry of entries) {
        result += processEntry(entry) + '\n\n';
    }
    return result.trim();
}

function processEntry(entry) {
    const lines = entry.split('\n').map(line => line.trim());
    let maxLength = 0;
    let formattedLines = [];
    for (let line of lines) {
        if (line.includes(':')) {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key.length > maxLength) maxLength = key.length;
            formattedLines.push({ key, value });
        } else {
            formattedLines.push({ text: line });
        }
    }
    return formattedLines.map(line => {
        if (line.key !== undefined) {
            return `${line.key.padEnd(maxLength)} : ${line.value}`;
        } else {
            return `${line.text}`;
        }
    }).join('\n');
}
