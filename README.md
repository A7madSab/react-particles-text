# React Particles Text

[![npm version](https://img.shields.io/npm/v/react-particles-text.svg)](https://www.npmjs.com/package/react-particles-text)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight and interactive React component that renders text as a field of animated particles on a canvas. Customize particle behavior, style, and interactivity to create visually engaging experiences for your website or application.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Storybook Documentation](#storybook-documentation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Interactive Particles:** Particles react to mouse movement, creating a dynamic and engaging effect.
- **Customizable Appearance:** Adjust particle sizes, densities, colors, and more.
- **Multiple Modes:** Easily switch between different visual styles (e.g., dark mode, colorful, subtle background).
- **Responsive Design:** Automatically adapts to container dimensions.
- **Storybook Documentation:** Comprehensive examples and live demos available via Storybook.

---

## Installation

Install the package via npm or yarn:

```bash
npm install react-particles-text
# or
yarn add react-particles-text
```

## Usage

Import and use the ```<ParticleText />``` component in your React project:

```JSX
import React from 'react';
import ParticleText from 'react-particles-text';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ParticleText
        text="HELLO WORLD"
        font="bold 60px Arial"
        textColor="#ffffff"
        bgParticleColor="rgba(255, 255, 255, 0.5)"
        offset={60}
        textParticleSize={1.5}
        bgParticleSize={[0.5, 1.5]}
        interactionDistance={100}
        returnSpeed={10}
        particleDensity={3}
        bgParticleDensity={1}
        backgroundColor="transparent"
      />
    </div>
  );
};

export default App;
```

This component uses an HTML canvas to render the particles, with interactive behavior that responds to mouse movement.

## Storybook Documentation

For live previews and comprehensive examples, check out the [Storybook Documentation](https://react-particles-text.vercel.app/?path=/story/components-particletext--dark-mode). The Storybook project includes several pre-configured stories that demonstrate different use cases and visual styles, including:

- Dark Mode: Light text on a dark background.
- Colorful: Vibrant particle colors with custom interaction settings.
- Multiple Words: Displaying multi-word text with customizable spacing.
- Large Particles: Emphasized particle sizes with stronger mouse interaction.
- Subtle Background: A gentle background effect with a lower particle density.
- Dense Particles: Highly populated particles for a detailed visual effect.
- Custom Font: Using a custom font style for the text particles.

## API Reference

| Prop Name           | Type                | Default                      | Description                                                                    |
|---------------------|---------------------|------------------------------|--------------------------------------------------------------------------------|
| text                | string              | —	                           | Text to display as particles.                                                  |
| offset              | number              | 60	                       | Vertical spacing between words when multiple words are present.                |
| font                | string              | "bold 60px Arial"	           | Font used to render the text particles.                                        |
| textColor           | string              | "white"                      | Color of the text particles.                                                   |
| bgParticleColor     | string              | "rgba(255, 255, 255, 0.5)" | Color of the background particles.                                             |
| textParticleSize    | number              | 1.5	                       | Size of the text particles.                                                    |
| bgParticleSize      | [number, number]    | [0.5, 1.5]	               | Range for the size of background particles.                                    |
| interactionDistance | number              | 100                          | Distance at which particles react to the mouse.                                |
| returnSpeed         | number              | 10	                       | Speed at which particles return to their original position.                    |
| particleDensity     | number              | 3	                           | Density of particles sampled from text (smaller values create more particles). |
| bgParticleDensity   | number              | 1	                           | Number of background particles per 5000px² of canvas.                          |
| className           | string              | "w-full h-full"              | Custom className for the canvas container.                                     |
| style               | React.CSSProperties | {}	                       | Inline style object for the canvas container.                                  |
| width               | number, string      | —	                           | Canvas width (defaults to container width).                                    |
| height              | number, string      | —	                           | Canvas height (defaults to container height).                                  |
| backgroundColor     | string              | "transparent"	               | Background color of the canvas.                                                |


## Contributing

Contributions are welcome! If you have ideas for improvements, bug fixes, or new features, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear commit messages.
4. Open a pull request explaining your changes.

Please ensure that your code adheres to the project’s coding standards.
