"use client";

import { useRef, useLayoutEffect, useCallback } from "react";
import { gsap, Expo } from "gsap";

// --- Utility Hooks ---
function useInstance<T>(value: T | (() => T)): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = typeof value === "function" ? (value as () => T)() : value;
  }
  return ref.current as T;
}

// --- Physics Calculations ---
function getScale(diffX: number, diffY: number) {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  return Math.min(distance / 735, 0.35);
}

function getAngle(diffX: number, diffY: number) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

// --- Main Component ---
export default function CircleCursor() {
  const jellyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // UseInstance ensures these objects are stable and created once

  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  const set = useInstance<any>({});

  // 1. Attach GSAP quick setters for optimized performance
  // FIX: Dependency array is now empty because 'set' is a stable reference.

  useLayoutEffect(() => {
    if (!jellyRef.current || !textRef.current) return;

    set.x = gsap.quickSetter(jellyRef.current, "x", "px");
    set.y = gsap.quickSetter(jellyRef.current, "y", "px");
    set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
    set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
    set.width = gsap.quickSetter(jellyRef.current, "width", "px");
    set.rt = gsap.quickSetter(textRef.current, "rotate", "deg");
  }, []); // <--- CORRECTED: Empty dependency array

  // 2. Animation loop (runs every frame)
  // Dependencies are stable references, but are included here for completeness

  const loop = useCallback(() => {
    const rotation = getAngle(vel.x, vel.y);
    const scale = getScale(vel.x, vel.y);

    set.x(pos.x);
    set.y(pos.y);
    set.width(50 + scale * 100);
    set.r(rotation);
    set.sx(1 + scale);
    set.sy(1 - scale);
    set.rt(-rotation);
  }, [pos, vel, set]); 


  // 3. Mouse movement handler and ticker setup
  // FIX: Only 'loop' is needed as a dependency here.
  useLayoutEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      gsap.to(pos, {
        x,
        y,
        duration: 1,
        ease: Expo.easeOut,
        onUpdate: () => {
          vel.x = x - pos.x;
          vel.y = y - pos.y;
        },
      });
    };

    window.addEventListener("mousemove", handleMove);
    gsap.ticker.add(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      gsap.ticker.remove(loop);
    };
  }, [loop]); 

  return (
    <div
      ref={jellyRef}
      className="
        fixed top-[-25px] left-[-25px] 
        flex items-center justify-center
        border-2 border-[#104e64]
        rounded-full pointer-events-none
        w-[50px] h-[50px]
        z-9999
        will-change-transform
      "
    >
      <div ref={textRef} className="flex items-center justify-center">
        <div className="innercircle h-1 w-1 rounded-full bg-blue-500">
          
        </div>
      </div>
    </div>
  );
}