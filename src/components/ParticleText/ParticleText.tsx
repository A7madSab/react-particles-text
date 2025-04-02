import React, { useEffect, useRef, useState } from "react";

// Class representing a single particle
class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  isTextParticle: boolean;
  speed: number;
  angle: number;
  color: string;

  constructor(
    x: number,
    y: number,
    isTextParticle: boolean,
    options: {
      size?: number;
      density?: number;
      speed?: number;
      color?: string;
    } = {}
  ) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.isTextParticle = isTextParticle;

    // Use provided options or fallback to defaults
    this.size =
      options.size ?? (isTextParticle ? 1.5 : Math.random() * 1 + 0.5);
    this.density =
      options.density ?? (isTextParticle ? Math.random() * 10 + 5 : 0);
    this.speed = options.speed ?? Math.random() * 0.5 + 0.1;
    this.color =
      options.color ?? (isTextParticle ? "white" : "rgba(255, 255, 255, 0.5)");

    this.angle = Math.random() * Math.PI * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(
    mouse: { x: number; y: number },
    canvasWidth: number,
    canvasHeight: number,
    options: {
      maxDistance?: number;
      returnSpeed?: number;
    } = {}
  ) {
    const maxDistance = options.maxDistance ?? 100;
    const returnSpeed = options.returnSpeed ?? 10;

    if (this.isTextParticle) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx / returnSpeed;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy / returnSpeed;
        }
      }
    } else {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Wrap particles around canvas edges
      if (this.x < 0 || this.x > canvasWidth) {
        this.x = (this.x + canvasWidth) % canvasWidth;
      }
      if (this.y < 0 || this.y > canvasHeight) {
        this.y = (this.y + canvasHeight) % canvasHeight;
      }
    }
  }
}

export interface IParticleText {
  /**
   * Text to display as particles
   */
  text: string;

  /**
   * Vertical space between words when there are multiple words
   * @default 60
   */
  offset?: number;

  /**
   * Font used to create text particles
   * @default "bold 60px Arial"
   */
  font?: string;

  /**
   * Color of the text particles
   * @default "white"
   */
  textColor?: string;

  /**
   * Color of the background particles
   * @default "rgba(255, 255, 255, 0.5)"
   */
  bgParticleColor?: string;

  /**
   * Size of text particles
   * @default 1.5
   */
  textParticleSize?: number;

  /**
   * Size of background particles
   * @default [0.5, 1.5] (random in this range)
   */
  bgParticleSize?: [number, number];

  /**
   * Distance at which particles react to mouse
   * @default 100
   */
  interactionDistance?: number;

  /**
   * Speed at which particles return to their original position
   * @default 10
   */
  returnSpeed?: number;

  /**
   * Density of particles sampled from text (smaller = more particles)
   * @default 3
   */
  particleDensity?: number;

  /**
   * Number of background particles per 5000px² of canvas
   * @default 1
   */
  bgParticleDensity?: number;

  /**
   * Custom className for the canvas
   */
  className?: string;

  /**
   * Canvas inline style object
   */
  style?: React.CSSProperties;

  /**
   * Canvas width (defaults to container width)
   */
  width?: number | string;

  /**
   * Canvas height (defaults to container height)
   */
  height?: number | string;

  /**
   * Background color of the canvas
   * @default "transparent"
   */
  backgroundColor?: string;
}

/**
 * ParticleText component that renders text as interactive particles
 */
const ParticleText: React.FC<IParticleText> = ({
  text,
  offset = 60,
  font = "bold 60px Arial",
  textColor = "white",
  bgParticleColor = "rgba(255, 255, 255, 0.5)",
  textParticleSize = 1.5,
  bgParticleSize = [0.5, 1.5],
  interactionDistance = 100,
  returnSpeed = 10,
  particleDensity = 3,
  bgParticleDensity = 1,
  className = "w-full h-full",
  style = {},
  width,
  height,
  backgroundColor = "transparent",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);

  // Update canvas dimensions when container size changes
  const updateDimensions = () => {
    if (!containerRef.current) return;

    const { offsetWidth, offsetHeight } = containerRef.current;
    setDimensions({
      width: typeof width === "number" ? width : offsetWidth,
      height: typeof height === "number" ? height : offsetHeight,
    });
  };

  // Initialize particles based on text and canvas dimensions
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");

    if (!offscreenCtx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Ensure dimensions are valid
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      console.error("Invalid canvas dimensions:", canvasWidth, canvasHeight);
      return;
    }

    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;

    // Draw text to offscreen canvas
    offscreenCtx.fillStyle = textColor;
    offscreenCtx.font = font;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";

    text.split(" ").forEach((word, index) => {
      offscreenCtx.fillText(
        word,
        canvasWidth / 2,
        canvasHeight / 2 +
          offset * index -
          ((text.split(" ").length - 1) * offset) / 2
      );
    });

    try {
      // Sample pixels from the text to create particles
      const imageData = offscreenCtx.getImageData(
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      if (imageData) {
        for (let y = 0; y < imageData.height; y += particleDensity) {
          for (let x = 0; x < imageData.width; x += particleDensity) {
            const index = (y * imageData.width + x) * 4;
            if (Number(imageData.data[index + 3]) > 128) {
              particlesRef.current.push(
                new Particle(x, y, true, {
                  size: textParticleSize,
                  color: textColor,
                })
              );
            }
          }
        }
      }

      // Add floating background particles
      const numBackgroundParticles = Math.floor(
        ((canvasWidth * canvasHeight) / 5000) * bgParticleDensity
      );
      for (let i = 0; i < numBackgroundParticles; i++) {
        const size =
          Math.random() * (bgParticleSize[1] - bgParticleSize[0]) +
          bgParticleSize[0];
        particlesRef.current.push(
          new Particle(
            Math.random() * canvasWidth,
            Math.random() * canvasHeight,
            false,
            {
              size,
              color: bgParticleColor,
            }
          )
        );
      }
    } catch (error) {
      console.error("Error getting image data:", error);
    }
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if specified
    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Update and draw each particle
    for (const particle of particlesRef.current) {
      particle.update(mouseRef.current, canvas.width, canvas.height, {
        maxDistance: interactionDistance,
        returnSpeed,
      });
      particle.draw(ctx);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Set up initial canvas and start animation
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Update particles when dimensions change or text changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    initializeParticles();

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [
    dimensions,
    text,
    font,
    textColor,
    bgParticleColor,
    particleDensity,
    bgParticleDensity,
    offset,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: width || "100%",
        height: height || "100%",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default ParticleText;
