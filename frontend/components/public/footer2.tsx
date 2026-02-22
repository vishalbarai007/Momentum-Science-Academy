import { useState, useEffect, useRef } from "react";

export default function Footer() {
    const canvasRef = useRef(null);
    const textWrapperRef = useRef(null);
    const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const val = Math.random() * 30;
            imageData.data[i] = val;
            imageData.data[i + 1] = val;
            imageData.data[i + 2] = val;
            imageData.data[i + 3] = 20;
        }
        ctx.putImageData(imageData, 0, 0);
    }, []);

    const handleMouseMove = (e) => {
        const rect = textWrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMouse({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <footer
            className="relative bg-black text-white min-h-[50vh] flex flex-col justify-between overflow-hidden"
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
            {/* Grain overlay */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                style={{ mixBlendMode: "screen" }}
            />

            {/* Giant outline text with glow hover */}
            <div className="relative flex-grow select-none overflow-hidden flex items-center justify-center pt-8">
                <div
                    ref={textWrapperRef}
                    className="relative cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => {
                        setIsHovering(false);
                        setMouse({ x: -9999, y: -9999 });
                    }}
                >
                    {/* Layer 1 — always visible stroke outline */}
                    <h1
                        className="text-[clamp(80px,16vw,320px)] font-black leading-none"
                        style={{
                            WebkitTextStroke: "2px rgba(255,255,255,0.18)",
                            color: "transparent",
                            letterSpacing: "-0.03em",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 900,
                            lineHeight: 0.9,
                            userSelect: "none",
                        }}
                    >
                        REDLINE
                    </h1>

                    {/* Layer 2 — glowing fill, clipped to 100px circle around cursor */}
                    <h1
                        className="absolute inset-0 text-[clamp(80px,16vw,320px)] font-black leading-none pointer-events-none"
                        style={{
                            letterSpacing: "-0.03em",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 900,
                            lineHeight: 0.9,
                            userSelect: "none",
                            /* Radial gradient as text fill — only visible within 100px of cursor */
                            backgroundImage: `radial-gradient(
                                circle 100px at ${mouse.x}px ${mouse.y}px,
                                #06d5fa 0%,
                                #00e5ff 50%,
                                transparent 100%
                            )`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                            WebkitTextStroke: "2px transparent",
                            /* Red glow only when hovering */
                            filter: isHovering
                                ? "drop-shadow(0 0 18px #00e5ff) drop-shadow(0 0 40px #00e5ff) drop-shadow(0 0 80px #00e5ff)"
                                : "none",
                            opacity: isHovering ? 1 : 0,
                            transition: "opacity 0.2s ease, filter 0.2s ease",
                        }}
                    >
                        REDLINE
                    </h1>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative border-t border-white/10 mx-8 py-6 flex items-center justify-between z-10">
                <p className="text-white/30 text-[11px] tracking-wide">
                    REDLINE v1.0 — Eisenberg-Noe Contagion Simulation
                </p>
                <p className="text-white/20 text-[11px]">
                    Built for SPIT-Hack 2026 &middot; Team LowerTaperFade
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
            `}</style>
        </footer>
    );
}