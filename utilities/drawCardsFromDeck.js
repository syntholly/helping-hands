const drawCardsFromDeck = (deckArray, x = 1) => {
    const selectedCards = [];

    // Make a copy of the deckArray to avoid modifying the original
    const updatedDeck = [...deckArray];

    // Determine the number of cards to draw (cannot be greater than the remaining cards in the deck)
    const numberOfCardsToDraw = Math.min(x, updatedDeck.length);

    // Take the first 'numberOfCardsToDraw' cards from the deck
    selectedCards.push(...updatedDeck.splice(0, numberOfCardsToDraw));

    return [selectedCards, updatedDeck];
};

export default drawCardsFromDeck;
