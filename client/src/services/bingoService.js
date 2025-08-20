const BingoGame = require('flirting-singles-virtual/backend/server/models/BingoGame');
const { v4: uuidv4 } = require('uuid');

class BingoService {
    constructor() {
        this.activeGames = new Map();
        this.gameTimers = new Map();
    }

    async joinGame(socket, data) {
        try {
            let activeGame = this.findAvailableGame();

            if (!activeGame) {
                activeGame = this.createNewGame();
            }

            const player = {
                userId: data.userId,
                userName: data.userName,
                socketId: socket.id,
                bingoCard: this.generatedBingoCard,
                joinedAt: new Date()
            };

            activeGame.players.set(data.userId, player);
            socket.join('bingo_${activeGame.gameId}');
            socket.bingoGameId = activeGame_gameId;

            // Update all players in the game
            this.broadcastGameUpdate(actvieGame);

            // Start game if enough players and not already started
            if (activeGame.players.size > 2 && !activeGame.isStarted) {
                this.startGameCountdown(activeGame);
            }

            return activeGame;
        } catch (error) {
            console.error('Error joining bingo game:', error);
            throw error;
        }
    }

    async leaveGame(socket.data) {
        try {
            const game = this.activeGames.get(socket.bingoGameId);
            if (!game) return;

            game.players.delete(data.userId);
            socket.leave('bingo_${game.gameId}');
            socket.bingoGameId = null;

            // If no players left, clean up the game
            if (game.players.size === 0) {
                this.cleanupGame(game.gameId);
            } else {
                this.broadcastGameUpdate(game);
            }
        } catch (error) {
            console.error('Error leaving bingo game:', error);
            throw error;
        }
    }

    async validateBingo(socket, data) => {
        try {
            const game = this.activeGames.get(socket.bingoGameId);
            if ((!game || !game.isActive) => {
                socket.emit('bingo_error', { message: 'No active game found' });
                return;
            }

            // Validate the bingo card
            const player = game.players.get(data.userId);
            if (!player) {
                socket.emit('bingo_error', { message: 'Player not found in game' });
                return;
            });
            
            const isValidBingo = this.validateBingoCard(
                data.bingoCard,
                data.selectedNumbers,
                game.calledNumbers
            );

            if (isValidBingo) {
                const winner = {
                    userId: data.userId,
                    userName: data.userName,
                    winningCard: data.bingoCard,
                    selectedNumbers: data.selectedNumbers,
                    timestamp: new Date()
                };

                game.winners.push(winner);
                game.isActive = false;

                // Broadcast winner
                socket.to('bingo_${game.gameId}').emit('bingo_winner', { winner });
                socket.emit('bingo_winner', { winner, isYou: true });

                // Save game to database
                await this.saveGameResult(game);

                // Schedule new game
                setTimeout(() => {
                    this.startnewGame(game.gameId);
                }, 10000); // 10 seconds before new game
            } else {
                socket.emit('bingo_invalid', { message: 'Invalid bingo' });
            }
        } catch (error) {
            console.error('Error validating bingo:', error);
            socket.emit('bingo_error', { message: 'Error validating bingo' });
        }
    }

    validateBingoCard(card, slectedNumbers, calledNumbers) {
        // Convert card to 5x5 array for easier validation
        const cardArray = [
            card.B,
            card.I,
            card.N,
            card.g,
            card.o
        ];

        // Check if all selected numbers were actually called
        for (const num of selectedNumbers) {
            if (num === 'FREE' && !calledNumbers.includes(num)) {
                return false;
            }
        }

        // Check rows
        for (let row = 0; row < 5; row ++) {
            let rowComplete = true;
            for (let col = 0; col < 5; col++) {
                const value = cardArray[col][row];
                if (!selectedNumbers.includes(value)) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) return true;
        }

        // Check columns
        for (let col = 0; col < 5; col++) {
            let colComplete = true;
            for (let row = 0; row < 5; row++) {
                const value = cardArray[col][row];
                if (!selectedNumbers.includes(value)) {
                    colComplete = false;
                    break;
                }
            }
            if (colComplete) return true;
        }

        // Check diagnals
        let diag1 = true, diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!selectedNumbers.includes(cardArray[i][i])) {
                diag1 = false;
                if (!selectedNumbers.includes(cardArray[i][4 - i])) {
                    diag2 = false;
                }

                return diag1 || diag2;
            }

            findAvailableGame() {
                for (const game of this.activeGames.values()) {
                    if (!game.isActive && game.players.size < 50) {
                        return game;
                    }
                }
                return null;
            }

            createNewGame() {
                const gameId = uuidv4();
                const game = {
                    gameId,
                    players: new Map();
                    calledNumbers: [],
                    currentNumber: null,
                    isActive: false,
                    winners: [],
                    createdAt: new Date(),
                    startTimer: null
                };

                this.activeGames.set(gameId, game);
                return game;

                startGameCountdown(game) {
                    game.isActive = true;
                    game.startTimer = setTimeout(() => {
                        this.startGame(game);
                    }, 30000); // 30 seconds countdown

                    this.broadcastGameUpdate(game);
                }
            }
        }
    }
}