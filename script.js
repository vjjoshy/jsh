let entryCount = 1;

function addEntry() {
    const container = document.getElementById('dataEntryContainer');
    const newTextarea = document.createElement('textarea');
    newTextarea.className = 'inputText';
    newTextarea.placeholder = 'Paste your manpower details here...';
    container.appendChild(newTextarea);
    entryCount++;
}

function extractData() {
    const textareas = document.getElementsByClassName('inputText');
    let allText = '';
    for (let i = 0; i < textareas.length; i++) {
        allText += textareas[i].value + '\n\n';
    }
    const extractedData = processText(allText);
    const conclusion = "\nIn conclusion, the above details outline the manpower distribution across various departments. Each section provides insights into the personnel assigned and activities performed, ensuring a comprehensive overview of the workforce.";
    document.getElementById('output').innerText = extractedData + conclusion;
}

function processText(text) {
    const sections = text.split(/\n\s*\n/); // Split by one or more empty lines to separate different blocks
    let result = '';

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        let maxLength = 0;

        // Find the maximum key length
        lines.forEach(line => {
            const [key, value] = line.split(':').map(item => item.trim());
            if (key && key.length > maxLength) maxLength = key.length;
        });

        // Format each line with aligned colons
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':').map(item => item.trim());
                result += `${key.padEnd(maxLength)} : ${value}\n`;
            } else if (trimmedLine.startsWith('*')) {
                result += `${trimmedLine}\n`; // Keep activity lines as is
            } else {
                result += `\n${trimmedLine}\n`; // Add a newline before non-colon lines (like MEP or conclusion)
            }
        });

        result += '\n'; // Add a newline after each section for better readability
    });

    return result.trim(); // Trim the final result to remove the last extra newline
}

  
