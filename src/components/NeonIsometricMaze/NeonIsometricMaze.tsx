import React, { useEffect, useRef } from "react";

export interface INeonIsometricMaze {
  /**
   * Base size of each grid cell
   * @default 15
   */
  cellSize?: number;

  /**
   * Animation speed factor
   * @default 0.05
   */
  animationSpeed?: number;

  /**
   * Primary neon color (start of gradient)
   * @default "rgba(0,255,255,.8)"
   */
  primaryColor?: string;

  /**
   * Secondary neon color (end of gradient)
   * @default "rgba(255,0,255,.8)"
   */
  secondaryColor?: string;

  /**
   * Outline color for the maze elements
   * @default "rgba(255,255,0,.5)"
   */
  outlineColor?: string;

  /**
   * Color for vertical lines
   * @default "rgba(255,255,255,.3)"
   */
  verticalLinesColor?: string;

  /**
   * Background fill color with alpha for trail effect
   * @default "rgba(0,0,0,.1)"
   */
  backdropColor?: string;

  /**
   * Canvas class name
   * @default "block"
   */
  className?: string;

  /**
   * Canvas inline style
   */
  style?: React.CSSProperties;

  /**
   * Width of the canvas (if not provided, uses full viewport width)
   */
  width?: number | string;

  /**
   * Height of the canvas (if not provided, uses full viewport height)
   */
  height?: number | string;
}

const NeonIsometricMaze: React.FC<INeonIsometricMaze> = ({
  cellSize = 15,
  animationSpeed = 0.05,
  primaryColor = "rgba(0,255,255,.8)",
  secondaryColor = "rgba(255,0,255,.8)",
  outlineColor = "rgba(255,255,0,.5)",
  verticalLinesColor = "rgba(255,255,255,.3)",
  backdropColor = "rgba(0,0,0,.1)",
  className = "block",
  style,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let time = 0;
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;

      // Use provided dimensions or fallback to window dimensions
      const canvasWidth =
        width !== undefined
          ? typeof width === "number"
            ? width
            : parseInt(width, 10) || window.innerWidth
          : window.innerWidth;

      const canvasHeight =
        height !== undefined
          ? typeof height === "number"
            ? height
            : parseInt(height, 10) || window.innerHeight
          : window.innerHeight;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      draw();
    };

    const draw = () => {
      if (!canvas || !context) return;

      const s = Math.min(canvas.width, canvas.height) / cellSize;
      const g = Math.ceil(canvas.width / s) * 2;
      const h = Math.ceil(canvas.height / (s * 0.5)) * 2;
      const w = canvas.width / 2;
      const v = canvas.height / 2;

      for (let y = -h; y < h; y++) {
        for (let i = -g; i < g; i++) {
          const p = w + ((i - y) * s) / 2;
          const q = v + ((i + y) * s) / 4;
          const m = Math.sqrt(i * i + y * y);
          const n = Math.sqrt(g * g + h * h);
          const e = 1 - m / n;
          const f = s * e * Math.abs(Math.sin(m * 0.5 + time));

          context.beginPath();
          context.moveTo(p, q - f);
          context.lineTo(p + s / 2, q - s / 2 - f);
          context.lineTo(p + s, q - f);
          context.lineTo(p + s, q);
          context.lineTo(p + s / 2, q + s / 2);
          context.lineTo(p, q);
          context.closePath();

          const gradient = context.createLinearGradient(p, q - f, p + s, q);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, secondaryColor);
          context.fillStyle = gradient;
          context.fill();
          context.strokeStyle = outlineColor;
          context.stroke();

          context.beginPath();
          context.moveTo(p, q);
          context.lineTo(p, q - f);
          context.moveTo(p + s, q);
          context.lineTo(p + s, q - f);
          context.moveTo(p + s / 2, q + s / 2);
          context.lineTo(p + s / 2, q - s / 2 - f);
          context.strokeStyle = verticalLinesColor;
          context.stroke();
        }
      }
    };

    const animate = () => {
      if (!canvas || !context) return;
      context.fillStyle = backdropColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      draw();
      time += animationSpeed;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle window resize only if width/height are not provided
    if (width === undefined || height === undefined) {
      window.addEventListener("resize", resize);
    }

    resize();
    animate();

    return () => {
      if (width === undefined || height === undefined) {
        window.removeEventListener("resize", resize);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    cellSize,
    animationSpeed,
    primaryColor,
    secondaryColor,
    outlineColor,
    verticalLinesColor,
    backdropColor,
    width,
    height,
  ]);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default NeonIsometricMaze;
