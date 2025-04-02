import type { Meta, StoryObj } from "@storybook/react";
import ParticleText from "./ParticleText";

const meta: Meta<typeof ParticleText> = {
  title: "Components/ParticleText",
  component: ParticleText,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text to display as particles",
    },
    offset: {
      control: { type: "range", min: 20, max: 120, step: 5 },
      description: "Vertical spacing between words",
    },
    font: {
      control: "text",
      description: "Font used for text particles",
    },
    textColor: {
      control: "color",
      description: "Color of text particles",
    },
    bgParticleColor: {
      control: "color",
      description: "Color of background particles",
    },
    textParticleSize: {
      control: { type: "range", min: 0.5, max: 5, step: 0.1 },
      description: "Size of text particles",
    },
    interactionDistance: {
      control: { type: "range", min: 50, max: 300, step: 10 },
      description: "Distance at which particles react to mouse",
    },
    returnSpeed: {
      control: { type: "range", min: 1, max: 50, step: 1 },
      description: "Speed at which particles return to original position",
    },
    particleDensity: {
      control: { type: "range", min: 1, max: 10, step: 1 },
      description:
        "Density of particles sampled from text (smaller = more particles)",
    },
    bgParticleDensity: {
      control: { type: "range", min: 0, max: 5, step: 0.1 },
      description: "Density of background particles",
    },
    backgroundColor: {
      control: "color",
      description: "Background color of the canvas",
    },
    width: {
      control: "text",
      description: "Canvas width (px or %)",
    },
    height: {
      control: "text",
      description: "Canvas height (px or %)",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ParticleText>;

// Light text on dark background
export const DarkMode: Story = {
  args: {
    text: "DARK MODE",
    backgroundColor: "#111827",
    textColor: "#ffffff",
    bgParticleColor: "rgba(255, 255, 255, 0.3)",
  },
};

// Colorful version
export const Colorful: Story = {
  args: {
    text: "COLORFUL",
    backgroundColor: "#0f172a",
    textColor: "#22d3ee",
    bgParticleColor: "rgba(244, 114, 182, 0.5)",
    interactionDistance: 150,
    textParticleSize: 2,
    returnSpeed: 5,
  },
};

// Multiple words example
export const MultipleWords: Story = {
  args: {
    text: "REACT BITS PARTICLE TEXT",
    backgroundColor: "#18181b",
    textColor: "#fcd34d",
    bgParticleColor: "rgba(252, 211, 77, 0.2)",
    offset: 80,
    particleDensity: 2,
    bgParticleDensity: 0.5,
  },
};

// Larger particles with stronger interaction
export const LargeParticles: Story = {
  args: {
    text: "BIG",
    backgroundColor: "#1e293b",
    textColor: "#f97316",
    bgParticleColor: "rgba(249, 115, 22, 0.2)",
    textParticleSize: 4,
    particleDensity: 4,
    interactionDistance: 200,
    returnSpeed: 20,
  },
};

// Subtle background effect
export const SubtleBackground: Story = {
  args: {
    text: "SUBTLE",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    bgParticleColor: "rgba(15, 23, 42, 0.1)",
    textParticleSize: 1.2,
    bgParticleDensity: 2,
    interactionDistance: 80,
  },
};

// Dense particles
export const DenseParticles: Story = {
  args: {
    text: "DENSE",
    backgroundColor: "#020617",
    textColor: "#a5f3fc",
    bgParticleColor: "rgba(165, 243, 252, 0.2)",
    particleDensity: 1, // Lower value = more particles
    bgParticleDensity: 3,
    interactionDistance: 120,
  },
};

// Custom font version
export const CustomFont: Story = {
  args: {
    text: "CUSTOM",
    font: "bold 70px Georgia",
    backgroundColor: "#0c0a09",
    textColor: "#facc15",
    bgParticleColor: "rgba(250, 204, 21, 0.15)",
  },
};
