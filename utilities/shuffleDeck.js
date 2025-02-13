const shuffleDeck = (deckArray) => {
    // Make a copy of the deckArray to avoid modifying the original
    const shuffledDeck = [...deckArray];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap the current element with the random one
        [shuffledDeck[i], shuffledDeck[randomIndex]] = [shuffledDeck[randomIndex], shuffledDeck[i]];
    }

    return shuffledDeck;
};

export default shuffleDeck;
