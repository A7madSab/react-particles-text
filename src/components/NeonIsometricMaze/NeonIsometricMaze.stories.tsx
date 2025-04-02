import type { Meta, StoryObj } from "@storybook/react";
import NeonIsometricMaze from "./NeonIsometricMaze";

const meta: Meta<typeof NeonIsometricMaze> = {
  title: "Animations/NeonIsometricMaze",
  component: NeonIsometricMaze,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable neon-themed isometric maze animation component built with Canvas.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    cellSize: {
      control: { type: "range", min: 5, max: 30, step: 1 },
      description: "Base size of each grid cell",
    },
    animationSpeed: {
      control: { type: "range", min: 0.01, max: 0.2, step: 0.01 },
      description: "Speed of the animation",
    },
    primaryColor: {
      control: "color",
      description: "Primary color for the gradient effect",
    },
    secondaryColor: {
      control: "color",
      description: "Secondary color for the gradient effect",
    },
    outlineColor: {
      control: "color",
      description: "Color for the cell outlines",
    },
    verticalLinesColor: {
      control: "color",
      description: "Color for vertical lines in the maze",
    },
    backdropColor: {
      control: "color",
      description: "Background color with alpha for trail effect",
    },
    width: {
      control: { type: "range", min: 200, max: 1000, step: 10 },
      description: "Width of the canvas in pixels",
    },
    height: {
      control: { type: "range", min: 200, max: 800, step: 10 },
      description: "Height of the canvas in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NeonIsometricMaze>;

export const Default: Story = {
  args: {
    width: 600,
    height: 400,
  },
};

export const CyberpunkTheme: Story = {
  args: {
    width: 600,
    height: 400,
    primaryColor: "rgba(255,215,0,0.8)", // Gold
    secondaryColor: "rgba(255,0,128,0.8)", // Hot pink
    outlineColor: "rgba(0,255,255,0.5)", // Cyan
    verticalLinesColor: "rgba(255,255,255,0.4)",
    backdropColor: "rgba(20,0,40,0.2)", // Dark purple background
    cellSize: 18,
    animationSpeed: 0.04,
  },
};

export const MatrixTheme: Story = {
  args: {
    width: 600,
    height: 400,
    primaryColor: "rgba(0,255,70,0.8)", // Matrix green
    secondaryColor: "rgba(150,255,180,0.8)", // Lighter green
    outlineColor: "rgba(0,200,0,0.5)",
    verticalLinesColor: "rgba(180,255,180,0.3)",
    backdropColor: "rgba(0,20,0,0.15)", // Dark green background
    cellSize: 12,
    animationSpeed: 0.06,
  },
};

export const SlowMotion: Story = {
  args: {
    width: 600,
    height: 400,
    animationSpeed: 0.01,
    backdropColor: "rgba(0,0,0,0.05)", // More trail effect
    cellSize: 20,
  },
};

export const HighDensity: Story = {
  args: {
    width: 600,
    height: 400,
    cellSize: 8, // Smaller cells = more maze elements
    animationSpeed: 0.03,
  },
};

export const CustomBorderRadius: Story = {
  args: {
    width: 600,
    height: 400,
    style: {
      borderRadius: "16px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "You can apply custom styling to the canvas element",
      },
    },
  },
};

// This story takes up the full viewport
export const Fullscreen: Story = {
  args: {},
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "When no width/height is provided, the component takes up the full viewport and responds to window resizing.",
      },
    },
  },
};

// Create a playground for users to experiment with all props
export const Playground: Story = {
  args: {
    width: 800,
    height: 500,
    cellSize: 15,
    animationSpeed: 0.05,
    primaryColor: "rgba(0,255,255,0.8)",
    secondaryColor: "rgba(255,0,255,0.8)",
    outlineColor: "rgba(255,255,0,0.5)",
    verticalLinesColor: "rgba(255,255,255,0.3)",
    backdropColor: "rgba(0,0,0,0.1)",
  },
};
