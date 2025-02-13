'use client';

import React, { useState } from 'react';
import drawCardsFromDeck from '@/utilities/drawCardsFromDeck';
import isLegalDeck from '@/utilities/isLegalDeck';
import parseDeck from '@/utilities/parseDeck';
import shuffleDeck from '@/utilities/shuffleDeck';
import { SpeedInsights } from '@vercel/speed-insights/next';

const RootPage = () => {
    const [deckInput, setDeckInput] = useState('');

    // Gameplay
    const [currentDeck, setCurrentDeck] = useState([]);
    const [currentHand, setCurrentHand] = useState([]);
    const [currentDiscard, setCurrentDiscard] = useState([]);
    const [currentTurn, setCurrentTurn] = useState(0);

    // Track cards drawn, discarded, returned, and shuffles per turn
    const [cardsDrawn, setCardsDrawn] = useState(0);
    const [cardsDiscarded, setCardsDiscarded] = useState(0);
    const [cardsReturnedToDeck, setCardsReturnedToDeck] = useState(0);
    const [shufflesPerTurn, setShufflesPerTurn] = useState(0);

    // Track total stats for all turns
    const [totalCardsDrawn, setTotalCardsDrawn] = useState(0);
    const [totalCardsDiscarded, setTotalCardsDiscarded] = useState(0);
    const [totalCardsReturnedToDeck, setTotalCardsReturnedToDeck] = useState(0);
    const [totalShuffles, setTotalShuffles] = useState(0);

    // Stats for all turns
    const [turnStats, setTurnStats] = useState([]);

    const handleDeckInputChange = (event) => {
        setDeckInput(event.target.value);
    };

    const handleParseDeck = (event) => {
        event.preventDefault();
        const parsedDeck = parseDeck(deckInput);
        setCurrentDeck(parsedDeck);
    };

    const handleIsLegalDeck = (event) => {
        event.preventDefault();
        const legal = isLegalDeck(currentDeck);
        console.log(legal ? 'Deck is legal.' : 'Deck is illegal.');
    };

    // Function to handle drawing cards
    const handleDrawCardsFromDeck = (numCards) => {
        const [selectedCards, updatedDeck] = drawCardsFromDeck(currentDeck, numCards);

        // Update hand and deck state
        setCurrentHand((prevHand) => [...prevHand, ...selectedCards]);
        setCurrentDeck(updatedDeck);

        // Update the cards drawn count
        setCardsDrawn((prevCount) => prevCount + selectedCards.length);
        setTotalCardsDrawn((prevCount) => prevCount + selectedCards.length);

        console.log('Drawn Cards:', selectedCards);
        console.log('Remaining Deck:', updatedDeck);
    };

    // Handle New Turn
    const handleNewTurn = () => {
        // Record the stats for the previous turn
        setTurnStats((prevStats) => [
            ...prevStats,
            {
                turn: currentTurn + 1,
                cardsDrawn,
                cardsDiscarded,
                cardsReturnedToDeck,
                shuffles: shufflesPerTurn,
            },
        ]);

        // Reset the counters for the next turn
        setCardsDrawn(0);
        setCardsDiscarded(0);
        setCardsReturnedToDeck(0);
        setShufflesPerTurn(0); // Reset shuffles for the new turn

        // Increment the turn number
        setCurrentTurn((prevTurn) => prevTurn + 1);
        console.log('New Turn:', currentTurn + 1);
    };

    const handleShuffleDeck = (event) => {
        event.preventDefault();
        const shuffledDeck = shuffleDeck(currentDeck);
        setCurrentDeck(shuffledDeck);
        setShufflesPerTurn((prevCount) => prevCount + 1);
        setTotalShuffles((prevCount) => prevCount + 1);

        console.log('Shuffled Deck:', shuffledDeck);
    };

    // Discard Card function
    const handleDiscardCard = (cardIndex) => {
        const cardToDiscard = currentHand[cardIndex];

        // Remove the card from the hand and add it to the discard pile
        setCurrentHand((prevHand) => prevHand.filter((_, index) => index !== cardIndex));
        setCurrentDiscard((prevDiscard) => [...prevDiscard, cardToDiscard]);

        // Update the cards discarded count
        setCardsDiscarded((prevCount) => prevCount + 1);
        setTotalCardsDiscarded((prevCount) => prevCount + 1);

        console.log('Discarded Card:', cardToDiscard);
        console.log('Current Discard Pile:', currentDiscard);
    };

    const handleReturnToDeck = (cardIndex) => {
        const cardToReturn = currentHand[cardIndex];

        // Remove the card from the hand and add it back to the deck
        setCurrentHand((prevHand) => prevHand.filter((_, index) => index !== cardIndex));
        setCurrentDeck((prevDeck) => [...prevDeck, cardToReturn]);

        // Shuffle the deck after returning the card
        const shuffledDeck = shuffleDeck([...currentDeck, cardToReturn]);
        setCurrentDeck(shuffledDeck);

        // Update returned cards count
        setCardsReturnedToDeck((prevCount) => prevCount + 1);
        setTotalCardsReturnedToDeck((prevCount) => prevCount + 1);

        // Increment shuffle stats
        setShufflesPerTurn((prevCount) => prevCount + 1);
        setTotalShuffles((prevCount) => prevCount + 1);

        console.log('Card returned to deck and shuffled:', cardToReturn);
    };

    const handleReturnToBottomOfDeck = (cardIndex) => {
        const cardToReturn = currentHand[cardIndex];

        // Remove the card from the hand and add it to the bottom of the deck
        setCurrentHand((prevHand) => prevHand.filter((_, index) => index !== cardIndex));
        setCurrentDeck((prevDeck) => [...prevDeck, cardToReturn]);

        // Update returned cards count
        setCardsReturnedToDeck((prevCount) => prevCount + 1);
        setTotalCardsReturnedToDeck((prevCount) => prevCount + 1);

        console.log('Card returned to bottom of deck:', cardToReturn);
    };

    // Calculate the color based on the percentage of deck seen
    const calculateRowColor = (cardsDrawn, remainingCards) => {
        const drawPercentage = (cardsDrawn / remainingCards) * 100;

        if (drawPercentage <= 20) return ''; // 0-20%
        if (drawPercentage <= 40) return ''; // 21-40%
        if (drawPercentage <= 60) return ''; // 41-60%
        if (drawPercentage <= 80) return ''; // 61-80%
        return ''; // 81-100%
    };

    return (
        <div className="container mx-auto p-6  rounded-lg shadow-md">
            <form className="mb-6">
                <textarea
                    className="border-2 border-gray-300 p-2 w-full rounded-lg mb-4"
                    name="deck-drop"
                    id="deck-drop"
                    value={deckInput}
                    onChange={handleDeckInputChange}
                    placeholder="Paste your deck here..."
                />
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="bg-blue-300 text-slate-50 py-2 px-4 rounded transition"
                        onClick={handleParseDeck}>
                        Parse Deck
                    </button>
                    <button
                        type="button"
                        className="bg-blue-300 text-slate-50 py-2 px-4 rounded transition"
                        onClick={handleIsLegalDeck}>
                        Check Legal Deck
                    </button>
                    <button
                        type="button"
                        className="bg-lime-400 text-slate-50 py-2 px-4 rounded transition"
                        onClick={() => handleDrawCardsFromDeck(1)}>
                        +1 Card
                    </button>
                    <button
                        type="button"
                        className="bg-lime-400 text-slate-50 py-2 px-4 rounded transition"
                        onClick={() => handleDrawCardsFromDeck(5)}>
                        +5 Cards
                    </button>
                    <button
                        type="button"
                        className="bg-lime-500 text-slate-50 py-2 px-4 rounded transition"
                        onClick={() => handleDrawCardsFromDeck(10)}>
                        +10 Cards
                    </button>
                    <button
                        type="button"
                        className="bg-orange-300 text-slate-50 py-2 px-4 rounded transition"
                        onClick={handleShuffleDeck}>
                        Shuffle Deck
                    </button>
                    <button
                        type="button"
                        className="bg-orange-300 text-slate-50 py-2 px-4 rounded transition"
                        onClick={handleNewTurn}>
                        New Turn
                    </button>
                </div>
            </form>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Turn Stats</h3>
                <table className="table-auto w-full border-collapse rounded-lg shadow-md">
                    <thead>
                        <tr className="">
                            <th className="border px-4 py-2 text-left">Turn</th>
                            <th className="border px-4 py-2 text-left">Cards Drawn</th>
                            <th className="border px-4 py-2 text-left">Cards Discarded</th>
                            <th className="border px-4 py-2 text-left">Cards Returned to Deck</th>
                            <th className="border px-4 py-2 text-left">Shuffles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnStats.map((stat, index) => {
                            // Calculate remaining cards after drawing this turn
                            const remainingCards = currentDeck.length + totalCardsDrawn - stat.cardsDrawn;

                            return (
                                <tr key={index} className={calculateRowColor(stat.cardsDrawn, remainingCards)}>
                                    <td className="border px-4 py-2">{stat.turn}</td>
                                    <td className="border px-4 py-2">{stat.cardsDrawn}</td>
                                    <td className="border px-4 py-2">{stat.cardsDiscarded}</td>
                                    <td className="border px-4 py-2">{stat.cardsReturnedToDeck}</td>
                                    <td className="border px-4 py-2">{stat.shuffles}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">All Turns Stats</h3>
                <table className="table-auto w-full border-collapse rounded-lg shadow-md">
                    <thead>
                        <tr className="">
                            <th className="border px-4 py-2 text-left">Turn</th>
                            <th className="border px-4 py-2 text-left">Cards Drawn</th>
                            <th className="border px-4 py-2 text-left">Cards Discarded</th>
                            <th className="border px-4 py-2 text-left">Cards Returned to Deck</th>
                            <th className="border px-4 py-2 text-left">Shuffles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnStats.map((stat, index) => (
                            <tr key={index} className={calculateRowColor()}>
                                <td className="border px-4 py-2">{stat.turn}</td>
                                <td className="border px-4 py-2">{stat.cardsDrawn}</td>
                                <td className="border px-4 py-2">{stat.cardsDiscarded}</td>
                                <td className="border px-4 py-2">{stat.cardsReturnedToDeck}</td>
                                <td className="border px-4 py-2">{stat.shuffles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Current Hand</h3>
                <div className="flex flex-wrap gap-4">
                    {currentHand.map((card, index) => (
                        <div key={index} className="border p-4 rounded shadow-lg">
                            <p>{card}</p> {/* Display the card */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="bg-lime-600 text-slate-50 py-1 px-3 rounded transition"
                                    onClick={() => handleReturnToDeck(index)}>
                                    Return to Deck & Shuffle
                                </button>
                                <button
                                    className="bg-orange-300 text-slate-50 py-1 px-3 rounded transition"
                                    onClick={() => handleReturnToBottomOfDeck(index)}>
                                    Return to Bottom of Deck
                                </button>
                                <button
                                    className="bg-red-300 text-slate-50 py-1 px-3 rounded transition"
                                    onClick={() => handleDiscardCard(index)}>
                                    Discard
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RootPage;
