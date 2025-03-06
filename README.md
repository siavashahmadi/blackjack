# BlackJack React Game

A modern, fully-featured Blackjack card game built with React, TypeScript, and a clean component architecture.

![BlackJack Game Preview](./screenshot.png)

## 🎮 Features

- Complete Blackjack game with realistic rules
- Responsive design works on desktop and mobile devices
- Beautiful card animations and interactions
- Game state management with React Context and useReducer
- Split hand functionality
- Betting system with chips
- Accessibility features
- Complete game actions:
  - Hit
  - Stand
  - Double Down
  - Surrender
  - Split (coming soon)

## 🚀 Tech Stack

- **React**: UI library
- **TypeScript**: Type safety and better developer experience
- **CSS Modules**: Component-scoped styling
- **Context API + useReducer**: State management
- **Vite**: Fast build tool and development server

## 📋 Prerequisites

- Node.js (version 14.0 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blackjack.git
cd blackjack
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎲 How to Play

1. **Start the Game**: Place your bet by clicking on chips
2. **Deal Cards**: Cards are dealt to you and the dealer (one dealer card is hidden)
3. **Player Turn**: Choose to Hit (take another card), Stand (end turn), Double Down (double your bet and take one more card), or Surrender (give up and lose half your bet)
4. **Dealer Turn**: After you stand, the dealer reveals their hidden card and draws cards until they reach 17 or more
5. **Game Resolution**: The player with the highest hand value without going over 21 wins

### Basic Rules:
- Card values: Number cards are worth their face value, face cards (Jack, Queen, King) are worth 10, and Aces can be worth 1 or 11
- Blackjack: An Ace and a 10-value card, pays 3:2
- Busting: If your hand value exceeds 21, you lose automatically
- Push: If both you and the dealer have the same value, it's a tie and your bet is returned

## 📁 Project Structure

```
/src
  /components - React components for the game
  /context - Game context and state management
  /hooks - Custom React hooks
  /styles - CSS modules and global styles
  /types - TypeScript type definitions
  /utils - Game utility functions
  App.tsx - Main app component
  main.tsx - Entry point
```

## 🔄 State Management

The game uses a robust state management system:

- **Context API**: Provides game state to all components
- **useReducer**: Manages complex state transitions using a reducer pattern
- **Custom Hooks**: Encapsulate game logic for reusability

## 🎯 Future Enhancements

- Complete implementation of Split hand functionality
- Multiplayer mode
- Persistent scoring and statistics
- Advanced betting options
- Card counting training mode
- Customizable rules and gameplay settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Card designs and game logic inspired by classic Blackjack games
- React and TypeScript communities for excellent documentation and tools
