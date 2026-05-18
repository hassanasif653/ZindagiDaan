import { useEffect, useRef } from "react";

const LogoFollowLight = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas ko full viewport set karo
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lightX = mouseX;
    let lightY = mouseY;

    // ✅ clientX/clientY directly use karo — koi calculation nahi
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth follow (lerp)
      lightX += (mouseX - lightX) * 0.08;
      lightY += (mouseY - lightY) * 0.08;

      // Glow effect
      const gradient = ctx.createRadialGradient(
        lightX, lightY, 0,
        lightX, lightY, 150
      );
      gradient.addColorStop(0, "rgba(255, 77, 77, 0.4)");
      gradient.addColorStop(1, "rgba(255, 77, 77, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Red dot
      ctx.beginPath();
      ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ff4d4d";
      ctx.shadowColor = "#ff4d4d";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default LogoFollowLight;