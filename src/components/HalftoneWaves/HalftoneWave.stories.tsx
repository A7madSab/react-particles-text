import type { Meta, StoryObj } from "@storybook/react";
import { HalftoneWave } from "./HalftoneWaves";

const meta = {
  title: "Animations/HalftoneWave",
  component: HalftoneWave,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
    dotColor: { control: "color" },
    gridSize: { control: { type: "range", min: 5, max: 50, step: 1 } },
    animationSpeed: {
      control: { type: "range", min: 0.01, max: 0.2, step: 0.01 },
    },
    trailOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    waveDensity: { control: { type: "range", min: 1, max: 30, step: 1 } },
    maxDotSize: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    maxDotOpacity: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    height: { control: "text" },
    width: { control: "text" },
    autoplay: { control: "boolean" },
  },
} satisfies Meta<typeof HalftoneWave>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backgroundColor: "black",
    dotColor: "white",
    gridSize: 20,
    animationSpeed: 0.05,
    trailOpacity: 0.1,
    waveDensity: 10,
    maxDotSize: 0.8,
    maxDotOpacity: 0.5,
    height: "100vh",
    width: "100%",
    autoplay: true,
  },
};

export const BlueTheme: Story = {
  args: {
    backgroundColor: "#001220",
    dotColor: "#00a8ff",
    gridSize: 15,
    animationSpeed: 0.04,
    trailOpacity: 0.2,
    waveDensity: 12,
    maxDotSize: 0.7,
    maxDotOpacity: 0.6,
    height: "100vh",
    width: "100%",
  },
};

export const GreenMatrix: Story = {
  args: {
    backgroundColor: "#000500",
    dotColor: "#00ff41",
    gridSize: 10,
    animationSpeed: 0.07,
    trailOpacity: 0.15,
    waveDensity: 15,
    maxDotSize: 0.6,
    maxDotOpacity: 0.8,
    height: "100vh",
    width: "100%",
  },
};

export const SlowMotion: Story = {
  args: {
    backgroundColor: "#1a1a1a",
    dotColor: "#ffffff",
    gridSize: 25,
    animationSpeed: 0.02,
    trailOpacity: 0.05,
    waveDensity: 8,
    maxDotSize: 0.9,
    maxDotOpacity: 0.4,
    height: "100vh",
    width: "100%",
  },
};

export const HighDensity: Story = {
  args: {
    backgroundColor: "#0a0a0a",
    dotColor: "#f5f5f5",
    gridSize: 8,
    animationSpeed: 0.05,
    trailOpacity: 0.1,
    waveDensity: 20,
    maxDotSize: 0.7,
    maxDotOpacity: 0.5,
    height: "100vh",
    width: "100%",
  },
};

export const PurpleGlow: Story = {
  args: {
    backgroundColor: "#13001a",
    dotColor: "#da70d6",
    gridSize: 18,
    animationSpeed: 0.04,
    trailOpacity: 0.15,
    waveDensity: 12,
    maxDotSize: 0.75,
    maxDotOpacity: 0.7,
    height: "100vh",
    width: "100%",
  },
};

export const FixedSizeExample: Story = {
  args: {
    backgroundColor: "#000000",
    dotColor: "#ffffff",
    gridSize: 15,
    height: 300,
    width: 500,
    animationSpeed: 0.05,
    trailOpacity: 0.1,
  },
  parameters: {
    layout: "centered",
  },
};

export const TransparentBackground: Story = {
  args: {
    backgroundColor: "transparent",
    dotColor: "#ff4500",
    gridSize: 20,
    animationSpeed: 0.05,
    trailOpacity: 0,
    waveDensity: 10,
    maxDotSize: 0.8,
    maxDotOpacity: 0.6,
    height: "300px",
    width: "100%",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          padding: "20px",
          height: "340px",
        }}
      >
        {Story()}
      </div>
    ),
  ],
};
