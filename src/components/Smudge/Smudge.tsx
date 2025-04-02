import React, { useRef, useEffect, useState, useCallback } from "react";
import "./Smudge.css";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
};

export interface ISmudge {
  /**
   * Canvas width (optional, defaults to container width)
   */
  width?: number | string;

  /**
   * Canvas height (optional, defaults to container height)
   */
  height?: number | string;

  /**
   * Background color of the canvas
   */
  backgroundColor?: string;

  /**
   * Fade speed for particle trails (0-1, lower = longer trails)
   */
  fadeSpeed?: number;

  /**
   * Speed of color evolution (0-1)
   */
  colorEvolutionSpeed?: number;

  /**
   * Initial color palette phase (0-5)
   */
  initialColorPhase?: number;

  /**
   * Custom color palettes (overrides defaults if provided)
   */
  colorPalettes?: string[][];

  /**
   * Enable download button
   */
  enableDownload?: boolean;

  /**
   * Enable clear button
   */
  enableClear?: boolean;

  /**
   * Enable fullscreen button
   */
  enableFullscreen?: boolean;

  /**
   * Custom class name for container
   */
  className?: string;

  /**
   * Custom class name for canvas
   */
  canvasClassName?: string;

  /**
   * Custom class name for button container
   */
  buttonContainerClassName?: string;

  /**
   * Custom download file name (without extension)
   */
  downloadFileName?: string;

  /**
   * Enable fullscreen mode
   */
  defaultFullscreen?: boolean;
}

export const Smudge: React.FC<ISmudge> = ({
  width,
  height,
  backgroundColor = "black",
  fadeSpeed = 0.03,
  colorEvolutionSpeed = 0.005,
  initialColorPhase = 0,
  colorPalettes,
  enableDownload = true,
  enableClear = true,
  enableFullscreen = true,
  className = "",
  canvasClassName = "",
  buttonContainerClassName = "",
  downloadFileName = "evolving-smudge",
  defaultFullscreen = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isDrawingRef = useRef(false);
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const [colorPhase, setColorPhase] = useState(initialColorPhase);
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen);

  // Default color palettes for evolution
  const defaultColorPalettes = [
    ["#3498db", "#2980b9", "#1abc9c", "#16a085"], // Blue to Teal
    ["#e74c3c", "#c0392b", "#f39c12", "#d35400"], // Red to Orange
    ["#9b59b6", "#8e44ad", "#3498db", "#2980b9"], // Purple to Blue
    ["#f1c40f", "#f39c12", "#e67e22", "#d35400"], // Yellow to Orange
    ["#1abc9c", "#16a085", "#2ecc71", "#27ae60"], // Teal to Green
  ];

  // Use custom palettes if provided, otherwise use defaults
  const activePalettes = colorPalettes || defaultColorPalettes;

  // Get current color palette based on phase
  const getCurrentPalette = useCallback(() => {
    return activePalettes[
      Math.floor(colorPhase) % activePalettes.length
    ] as string[];
  }, [colorPhase, activePalettes]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1]!, 16),
          g: Number.parseInt(result[2]!, 16),
          b: Number.parseInt(result[3]!, 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Get a random color from the current palette with transition to next palette
  const getRandomColor = useCallback(() => {
    const currentPalette = getCurrentPalette();
    const nextPaletteIndex =
      (Math.floor(colorPhase) + 1) % activePalettes.length;
    const nextPalette = activePalettes[nextPaletteIndex];

    const transitionProgress = colorPhase % 1;
    const colorIndex = Math.floor(
      Math.random() * (currentPalette?.length ?? 0)
    );

    // Get colors from current and next palette
    const currentColor = currentPalette[colorIndex]!;
    const nextColor = nextPalette && nextPalette[colorIndex]!;

    // Parse the hex colors to RGB
    const currentRGB = hexToRgb(currentColor);
    const nextRGB = hexToRgb(nextColor!);

    // Interpolate between the colors
    const r = Math.floor(
      currentRGB.r * (1 - transitionProgress) + nextRGB.r * transitionProgress
    );
    const g = Math.floor(
      currentRGB.g * (1 - transitionProgress) + nextRGB.g * transitionProgress
    );
    const b = Math.floor(
      currentRGB.b * (1 - transitionProgress) + nextRGB.b * transitionProgress
    );

    return `rgb(${r}, ${g}, ${b})`;
  }, [colorPhase, getCurrentPalette, activePalettes]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      // Set canvas dimensions to match container or use provided dimensions
      canvas.width = typeof width === "number" ? width : container.clientWidth;
      canvas.height =
        typeof height === "number" ? height : container.clientHeight;

      // Clear and redraw
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Initial sizing
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Start color evolution
    const colorInterval = setInterval(() => {
      setColorPhase((prev) => prev + colorEvolutionSpeed);
    }, 100);

    // Animation loop
    let animationFrameId: number;

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Apply fade effect to create trails
      ctx.fillStyle = `rgba(${
        backgroundColor === "black" ? "0, 0, 0" : "255, 255, 255"
      }, ${fadeSpeed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Decrease life
        particle.life--;

        // Remove dead particles
        if (particle.life <= 0) {
          particlesRef.current.splice(index, 1);
          return;
        }

        // Calculate opacity based on life
        const opacity = particle.life / particle.maxLife;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3 + opacity * 5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color
          .replace("rgb", "rgba")
          .replace(")", `, ${opacity})`);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(colorInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundColor, width, height, fadeSpeed, colorEvolutionSpeed]);

  // Handle mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return {
          x: e.touches[0]!.clientX - rect.left,
          y: e.touches[0]!.clientY - rect.top,
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const createParticles = (
      x: number,
      y: number,
      prevX: number,
      prevY: number
    ) => {
      // Calculate distance and angle between current and previous position
      const dx = x - prevX;
      const dy = y - prevY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Create particles along the path
      const count = Math.max(Math.floor(distance / 5), 1);

      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : i / (count - 1);
        const px = prevX + dx * t;
        const py = prevY + dy * t;

        // Add some randomness to velocity
        const spread = 2;
        const vx = Math.cos(angle) * 2 + (Math.random() - 0.5) * spread;
        const vy = Math.sin(angle) * 2 + (Math.random() - 0.5) * spread;

        // Create 3-5 particles at each point for a fuller effect
        const particleCount = 3 + Math.floor(Math.random() * 3);

        for (let j = 0; j < particleCount; j++) {
          particlesRef.current.push({
            x: px + (Math.random() - 0.5) * 10,
            y: py + (Math.random() - 0.5) * 10,
            vx: vx + (Math.random() - 0.5) * 2,
            vy: vy + (Math.random() - 0.5) * 2,
            color: getRandomColor(),
            life: 50 + Math.random() * 100,
            maxLife: 50 + Math.random() * 100,
          });
        }
      }
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const pos = getPosition(e);
      prevPositionRef.current = pos;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;

      const pos = getPosition(e);
      createParticles(
        pos.x,
        pos.y,
        prevPositionRef.current.x,
        prevPositionRef.current.y
      );
      prevPositionRef.current = pos;
    };

    const handleEnd = () => {
      isDrawingRef.current = false;
    };

    // Mouse events
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseout", handleEnd);

    // Touch events
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("touchend", handleEnd);

    return () => {
      // Cleanup
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseout", handleEnd);

      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
    };
  }, [getRandomColor]);

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
  };

  // Save canvas as image
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${downloadFileName}-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`smudge-container ${
        isFullscreen ? "smudge-fullscreen" : ""
      } ${className}`}
    >
      <canvas ref={canvasRef} className={`smudge-canvas ${canvasClassName}`} />

      {(enableClear || enableDownload || enableFullscreen) && (
        <div className={`smudge-buttons ${buttonContainerClassName}`}>
          {enableClear && (
            <button
              onClick={handleClear}
              className="smudge-button"
              aria-label="Clear Canvas"
            >
              <RefreshIcon />
            </button>
          )}

          {enableDownload && (
            <button
              onClick={handleSave}
              className="smudge-button"
              aria-label="Save Image"
            >
              <DownloadIcon />
            </button>
          )}

          {enableFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="smudge-button smudge-button-text"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Simple icon components to avoid dependencies
const RefreshIcon = () => (
  <svg className="smudge-icon" viewBox="0 0 24 24">
    <path d="M23 4v6h-6"></path>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg className="smudge-icon" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default Smudge;
