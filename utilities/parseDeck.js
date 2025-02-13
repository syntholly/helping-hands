const parseDeck = (inputData) => {
    const cards = [];
    const lines = inputData.trim().split('\n');

    lines.forEach((line) => {
        // Skip lines that don't start with a number (i.e., section headings and improperly formatted lines)
        if (!/^\d/.test(line)) {
            return;
        }

        // Split line into parts (count, name, card ID)
        const parts = line.split(/\s+/);

        if (parts.length < 3) {
            return; // Skip lines that don't match the expected format
        }

        const count = parseInt(parts[0], 10); // The first value is the count
        const name = parts.slice(1, parts.length - 1).join(' '); // The name is all parts except the first and last
        const cardId = parts[parts.length - 1]; // The last value is the card ID

        // Add the card to the array the specified number of times (including duplicates)
        for (let i = 0; i < count; i++) {
            cards.push(`${name} ${cardId}`);
        }
    });

    return cards;
};
export default parseDeck;
