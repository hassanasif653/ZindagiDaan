import React, { useEffect, useRef } from "react";

interface BloodCell {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
}

const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<BloodCell[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const createCells = () => {
      const cells: BloodCell[] = [];
      const cellCount = Math.min(
        80,
        Math.floor((canvas.width * canvas.height) / 15000),
      );

      for (let i = 0; i < cellCount; i++) {
        cells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.4 + 0.2,
          angle: Math.random() * Math.PI * 2,
        });
      }
      cellsRef.current = cells;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 6 + 2,
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    createCells();
    createParticles();

    const drawCell = (cell: BloodCell) => {
      ctx.beginPath();
      ctx.ellipse(
        cell.x,
        cell.y,
        cell.size,
        cell.size * 0.7,
        cell.angle,
        0,
        Math.PI * 2,
      );

      const gradient = ctx.createRadialGradient(
        cell.x,
        cell.y,
        0,
        cell.x,
        cell.y,
        cell.size,
      );

      gradient.addColorStop(0, `rgba(220, 38, 38, ${cell.opacity})`);
      gradient.addColorStop(0.7, `rgba(185, 28, 28, ${cell.opacity * 0.7})`);
      gradient.addColorStop(1, `rgba(153, 27, 27, ${cell.opacity * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowColor = `rgba(220, 38, 38, ${cell.opacity * 0.5})`;
      ctx.shadowBlur = cell.size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Animation loop
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle gradient background
      // ... (Background logic remains the same) ...
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      bgGradient.addColorStop(0, "rgba(254, 242, 242, 0.0)");
      bgGradient.addColorStop(0.5, "rgba(254, 226, 226, 0.0)");
      bgGradient.addColorStop(1, "rgba(254, 242, 242, 0.0)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pulseFactor = Math.sin(time / 500) * 0.5 + 0.5;
      const baseOpacity = 0.1;
      const pulsingOpacity = baseOpacity + baseOpacity * 2 * pulseFactor;

      // --- 1. Update and draw Blood Cells ---
      cellsRef.current.forEach((cell) => {
        // ... (Cell movement logic remains the same) ...
        cell.x += Math.cos(cell.angle) * cell.speed;
        cell.y += Math.sin(cell.angle) * cell.speed * 0.5;
        cell.angle += 0.01;
        if (cell.x < 0 || cell.x > canvas.width) {
          cell.angle = Math.PI - cell.angle;
        }
        if (cell.y < 0 || cell.y > canvas.height) {
          cell.angle = -cell.angle;
        }
        cell.x = Math.max(0, Math.min(canvas.width, cell.x));
        cell.y = Math.max(0, Math.min(canvas.height, cell.y));
        drawCell(cell);
      });

      // --- 2. Update and draw Floating Particles (New) ---
      particlesRef.current.forEach((particle) => {
        // Simple floating movement
        particle.x += Math.cos(particle.angle) * particle.speed * 0.5;
        particle.y += Math.sin(particle.angle) * particle.speed * 0.5;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.angle = Math.PI - particle.angle;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.angle = -particle.angle;
        }

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle (white/light color)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`; // Light, subtle color
        ctx.shadowColor = `rgba(255, 255, 255, 0.5)`;
        ctx.shadowBlur = 1;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const MAX_CELL_DISTANCE = 150;
      cellsRef.current.forEach((cell1, i) => {
        cellsRef.current.slice(i + 1).forEach((cell2) => {
          const dx = cell1.x - cell2.x;
          const dy = cell1.y - cell2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_CELL_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(cell1.x, cell1.y);
            ctx.lineTo(cell2.x, cell2.y);

            const connectionStrength = 1 - distance / MAX_CELL_DISTANCE;
            const finalOpacity = pulsingOpacity * connectionStrength;

            ctx.strokeStyle = `rgba(220, 38, 38, ${finalOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // --- 4. Auto Connection: Cell to Particle (NEW CONNECTION) ---
      const MAX_MIXED_DISTANCE = 120;
      cellsRef.current.forEach((cell) => {
        particlesRef.current.forEach((particle) => {
          const dx = cell.x - particle.x;
          const dy = cell.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_MIXED_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(cell.x, cell.y);
            ctx.lineTo(particle.x, particle.y);

            const connectionStrength = 1 - distance / MAX_MIXED_DISTANCE;

            const finalOpacity = pulsingOpacity * connectionStrength * 0.8;

            ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const animateWrapper = (time: number) => {
      animate(time);
    };

    animateWrapper(0);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Canvas for all animations */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* HTML-based effects (Only Pulsing Circles remain) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Pulsing circles*/}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-red-300/20"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animation: `pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Floating particles */}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.4;
          }
        }

        @keyframes float { 
          0% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
