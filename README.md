# 🎮 Glow Rush

A fast neon arcade game where you dash and dodge. Built with TypeScript + Canvas API for smooth gameplay at 60fps.

![Game Preview](./preview.png)

## 🚀 Features

- **Dash Mechanics** - Use spacebar to dash through obstacles
- **Glowing Trail Effects** - Beautiful particle system with neon trails
- **Progressive Difficulty** - Game gets harder as you level up
- **Smooth 60fps Gameplay** - Optimized Canvas rendering
- **Responsive Controls** - WASD or Arrow keys for movement
- **Score & Level System** - Collect targets to increase your score

## 🎯 How to Play

- **Move**: Use `WASD` or `Arrow Keys` to move around
- **Dash**: Press `Space` to dash in your current direction
- **Objective**: Collect orange targets while avoiding red hazards
- **Scoring**: Each target gives +1 score, level up every 5 targets
- **Survival**: Don't touch the red hazards or you'll restart!

## 🛠️ Technology Stack

- **TypeScript** - Type-safe development
- **Canvas API** - Hardware-accelerated 2D graphics
- **Modular Architecture** - Clean separation of concerns
- **ES6 Modules** - Modern JavaScript module system

## 📁 Project Structure

src/
├── game/
│ ├── game.ts # Main game class
│ └── managers/
│ ├── canvas-manager.ts # Canvas setup & DPI handling
│ ├── entity-manager.ts # Game objects management
│ ├── input-manager.ts # Keyboard input handling
│ ├── player-manager.ts # Player physics & movement
│ ├── renderer-manager.ts # All rendering operations
│ └── ui-manager.ts # UI updates & HUD
├── types/
│ ├── player.ts # Player interface
│ ├── target.ts # Target interface
│ ├── hazard.ts # Hazard interface
│ └── particle.ts # Particle interface
├── utils/
│ └── clamp.ts # Utility functions
├── main.ts # Application entry point
└── style.css # Game styling
