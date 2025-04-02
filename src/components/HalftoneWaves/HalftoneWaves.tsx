import { useEffect, useRef } from "react";

export interface IHalftoneWave {
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Color of the halftone dots */
  dotColor?: string;
  /** Size of the grid cells in pixels */
  gridSize?: number;
  /** Speed of the animation (lower is slower) */
  animationSpeed?: number;
  /** Opacity of the trail effect (0-1) */
  trailOpacity?: number;
  /** Number of wave cycles */
  waveDensity?: number;
  /** Maximum dot size as a fraction of gridSize */
  maxDotSize?: number;
  /** Maximum opacity of dots */
  maxDotOpacity?: number;
  /** Canvas height (defaults to full screen) */
  height?: string | number;
  /** Canvas width (defaults to full width) */
  width?: string | number;
  /** Custom className for the canvas */
  className?: string;
  /** Whether the animation should autoplay */
  autoplay?: boolean;
}

/**
 * HalftoneWave - A customizable animated halftone wave effect component
 */
export const HalftoneWave = ({
  backgroundColor = "black",
  dotColor = "white",
  gridSize = 20,
  animationSpeed = 0.05,
  trailOpacity = 0.1,
  waveDensity = 10,
  maxDotSize = 0.8,
  maxDotOpacity = 0.5,
  height = "100vh",
  width = "100%",
  className = "",
  autoplay = true,
}: IHalftoneWave) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // Handle percentage-based dimensions
      if (typeof width === "string" && width.endsWith("%")) {
        canvas.width = (parent.offsetWidth * parseInt(width)) / 100;
      } else if (width === "100%") {
        canvas.width = parent.offsetWidth;
      } else {
        canvas.width = typeof width === "number" ? width : parent.offsetWidth;
      }

      if (typeof height === "string" && height.endsWith("%")) {
        canvas.height = (parent.offsetHeight * parseInt(height)) / 100;
      } else if (height === "100vh") {
        canvas.height = window.innerHeight;
      } else {
        canvas.height =
          typeof height === "number" ? height : parent.offsetHeight;
      }
    };

    const drawHalftoneWave = () => {
      const rows = Math.ceil(canvas.height / gridSize);
      const cols = Math.ceil(canvas.width / gridSize);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize;
          const centerY = y * gridSize;
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) +
              Math.pow(centerY - canvas.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2)
          );
          const normalizedDistance = distanceFromCenter / maxDistance;

          const waveOffset =
            Math.sin(normalizedDistance * waveDensity - timeRef.current) * 0.5 +
            0.5;
          const size = gridSize * waveOffset * maxDotSize;

          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);

          // Parse the dotColor to get RGB components
          let r, g, b;
          if (dotColor === "white") {
            r = g = b = 255;
          } else if (dotColor === "black") {
            r = g = b = 0;
          } else if (dotColor.startsWith("#")) {
            const hex = dotColor.slice(1);
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
          } else {
            // Default to white if color parsing fails
            r = g = b = 255;
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${
            waveOffset * maxDotOpacity
          })`;
          ctx.fill();
        }
      }
    };

    const animate = () => {
      // Apply trail effect with specified opacity
      ctx.fillStyle =
        backgroundColor === "transparent"
          ? "rgba(0, 0, 0, 0)"
          : `${
              backgroundColor.startsWith("rgba")
                ? backgroundColor
                : `rgba(0, 0, 0, ${trailOpacity})`
            }`;

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHalftoneWave();

      timeRef.current += animationSpeed;
      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animate();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (autoplay) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    backgroundColor,
    dotColor,
    gridSize,
    animationSpeed,
    trailOpacity,
    waveDensity,
    maxDotSize,
    maxDotOpacity,
    height,
    width,
    autoplay,
  ]);

  const canvasStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    backgroundColor,
  };

  return <canvas ref={canvasRef} className={className} style={canvasStyle} />;
};

/**
 * For backwards compatibility with default exports
 */
export default HalftoneWave;
