import type { Meta, StoryObj } from "@storybook/react";
import { Smudge } from "./Smudge";

const meta: Meta<typeof Smudge> = {
  title: "Components/Smudge",
  component: Smudge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "text" },
      description: "Canvas width (defaults to container width)",
    },
    height: {
      control: { type: "text" },
      description: "Canvas height (defaults to container height)",
    },
    backgroundColor: {
      control: { type: "color" },
      description: "Background color of the canvas",
    },
    fadeSpeed: {
      control: { type: "range", min: 0.01, max: 0.2, step: 0.01 },
      description:
        "Fade speed for particle trails (0-1, lower = longer trails)",
    },
    colorEvolutionSpeed: {
      control: { type: "range", min: 0.001, max: 0.05, step: 0.001 },
      description: "Speed of color evolution (0-1)",
    },
    initialColorPhase: {
      control: { type: "range", min: 0, max: 5, step: 0.1 },
      description: "Initial color palette phase (0-5)",
    },
    enableDownload: {
      control: "boolean",
      description: "Enable download button",
    },
    enableClear: {
      control: "boolean",
      description: "Enable clear button",
    },
    enableFullscreen: {
      control: "boolean",
      description: "Enable fullscreen button",
    },
    downloadFileName: {
      control: "text",
      description: "Custom download file name (without extension)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Smudge>;

// Default setup
export const Default: Story = {
  args: {
    className: "w-full h-[500px] max-w-4xl",
    backgroundColor: "#000000",
    fadeSpeed: 0.03,
    colorEvolutionSpeed: 0.005,
    enableDownload: true,
    enableClear: true,
    enableFullscreen: true,
  },
};

// Light background variant
export const LightBackground: Story = {
  args: {
    ...Default.args,
    backgroundColor: "#ffffff",
    className: "w-full h-[500px] max-w-4xl border border-gray-200",
  },
};

// Fast color evolution
export const FastColorEvolution: Story = {
  args: {
    ...Default.args,
    colorEvolutionSpeed: 0.02,
  },
};

// Long trails
export const LongTrails: Story = {
  args: {
    ...Default.args,
    fadeSpeed: 0.01,
  },
};

// Custom color palettes
export const CustomColorPalettes: Story = {
  args: {
    ...Default.args,
    colorPalettes: [
      ["#FF6B6B", "#FF8E8E", "#FF4949", "#FF0000"], // Red shades
      ["#4ECDC4", "#2EC4B6", "#1A535C", "#56E39F"], // Teal and green
      ["#F9C80E", "#F86624", "#EA3546", "#662E9B"], // Sunset colors
    ],
  },
};

// Minimal UI (no buttons)
export const MinimalUI: Story = {
  args: {
    ...Default.args,
    enableDownload: false,
    enableClear: false,
    enableFullscreen: false,
  },
};

// Fixed size
export const FixedSize: Story = {
  args: {
    ...Default.args,
    width: 600,
    height: 400,
    className: "border border-gray-300",
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Experiment with different settings to see how they affect the Smudge.",
      },
    },
  },
};
