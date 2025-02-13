const isLegalDeck = (cardArray) => {
    const cardCount = {}; // To track occurrences of each card
    let hasEnergyCard = false;

    // Decks should be 60 cards exactly.
    if (cardArray.length !== 60) {
        return false;
    }

    // Count occurrences of each card
    for (const card of cardArray) {
        // If the card is an energy card, mark that we have at least one energy card
        if (/Energy/.test(card)) {
            hasEnergyCard = true;
        }

        // Track how many times each card appears
        cardCount[card] = (cardCount[card] || 0) + 1;

        // If a card appears more than 4 times, the deck is not legal
        if (cardCount[card] > 4) {
            return false;
        }
    }

    // Ensure there is at least one energy card
    if (!hasEnergyCard) {
        return false;
    }

    // If both conditions are satisfied, the deck is legal
    return true;
};
export default isLegalDeck;
