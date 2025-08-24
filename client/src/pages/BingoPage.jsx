import React, { useState, useEffect } from 'react';


const BingoPage = () => {
    const [bingoCard, setBingoCard] = useState([]);
    const [calledNumbers, setCalledNumbers] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [players, setPlayers] = useState([
        { name: 'You', score: 0 },
        { name: 'Autumn', score: 2 },
        { name: 'Winter', score: 1 },
        { name: 'Kid', score: 0 }
    ]);

    useEffect(() => {
        generateBingoCard();
    }, []);

    const generateBingoCard = () => {
        const card = [];
        const ranges = [
            [1, 15], // B
            [16, 30], // I
            [31, 45], // N
            [46, 60], // G
            [61, 75], // O
        ];

        for (let col = 0; col < 5; col++) {
            const column = [];
            const [min, max] = ranges[col];
            const used = new Set();

            for (let row = 0; row < 5; row++) {
                if (col === 2 && row === 2) {
                    column.push({ number: 'FREE', marked: true, free: true });
                } else {
                    let num;
                    do {
                        num = Math.floor(Math.random() * (max - min + 1)) + min;
                    } while (used.has(num));
                    used.add(num);
                    column.push({ number: num, marked: false, free: false });
                }
            }
            card.push(column);
        }
        setBingoCard(card);
    };

    const markNumber = (col, row) => {
        if (bingoCard[col][row].free) return;

        const newCard = [...bingoCard];
        newCard[col][row].marked = !newCard[col][row].marked;
        setBingoCard(newCard);
    };

        };

    const startGame = () => {
        setGameActive(true);
        setCalledNumbers([]);
        generateBingoCard();
    };

    return (
        <div className="container">
            <div className="bingo-header">
                <h1>Virtual Bingo</h1>
                <p>Play with other members and win prizes</p>
        </div>

        <div className="bingo-game">
            <div className="bingo-sidebar">
                <div className="game-controls">
                    <button
                       className="btn btn-primary"
                       onClick={startGame}
                    >
                        {gameActive ? 'New Game' : 'Start Game'}
                    </button>
                </div>

                <div className="called-numbers">
                    <h3>Called Numbers</h3>
                    <div className="numbers-grid">
                        {calledNumbers.slice(-10).map((num, index) => (
                            <span key={index} className="called-numbers">{num}</span>
                        ))}
                    </div>
                </div>

               <div className="players-list">
                <h3>Players</h3>
                {players.map((player, index) => (
                    <div key={index} className="player-item">
                        <span>{player.name}</span>
                        <span className="player-score">{player.score} wins</span>
                        </div>
                ))}
               </div>
            

 