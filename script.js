function extractData() {
    const inputText = document.getElementById('inputText').value;
    const extractedData = processText(inputText);
    document.getElementById('output').innerText = extractedData;
}

function processText(text) {
    const sections = text.split('\n\n'); // Split by double newline to separate different blocks
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
            } else {
                result += `${trimmedLine}\n`; // For lines without colons (like activity details)
            }
        });

        result += '\n'; // Add a newline after each section for better readability
    });

    return result.trim(); // Trim the final result to remove the last extra newline
}
