import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";

const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<string>('#FFE500');
  const currentTheme = useThemeStore((s) => s.currentTheme);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    document.documentElement.classList.add('custom-cursor-active');

    const mouse = { x: 0, y: 0 };
    const outerPos = { x: 0, y: 0 };
    let lastInteractive = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      const el = e.target as HTMLElement;
      const interactive = !!el.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]');

      if (outerRef.current && interactive !== lastInteractive) {
        lastInteractive = interactive;
        const color = colorRef.current;
        if (interactive) {
          outerRef.current.style.width = '48px';
          outerRef.current.style.height = '48px';
          outerRef.current.style.backgroundColor = color;
          outerRef.current.style.borderColor = color;
          outerRef.current.style.opacity = '0.6';
          outerRef.current.style.marginLeft = '-24px';
          outerRef.current.style.marginTop = '-24px';
        } else {
          outerRef.current.style.width = '32px';
          outerRef.current.style.height = '32px';
          outerRef.current.style.backgroundColor = 'transparent';
          outerRef.current.style.borderColor = color;
          outerRef.current.style.opacity = '1';
          outerRef.current.style.marginLeft = '-16px';
          outerRef.current.style.marginTop = '-16px';
        }
      }
    };

    const onDown = () => {
      if (innerRef.current) {
        innerRef.current.style.width = '16px';
        innerRef.current.style.height = '16px';
        innerRef.current.style.marginLeft = '-8px';
        innerRef.current.style.marginTop = '-8px';
      }
    };

    const onUp = () => {
      if (innerRef.current) {
        innerRef.current.style.width = '8px';
        innerRef.current.style.height = '8px';
        innerRef.current.style.marginLeft = '-4px';
        innerRef.current.style.marginTop = '-4px';
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    let raf: number;
    const lerp = () => {
      outerPos.x += (mouse.x - outerPos.x) * 0.15;
      outerPos.y += (mouse.y - outerPos.y) * 0.15;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.x}px, ${outerPos.y}px)`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const color = getComputedStyle(document.body).getPropertyValue('--t-cursor-color').trim() || '#FFE500';
    colorRef.current = color;
    if (innerRef.current) {
      innerRef.current.style.backgroundColor = color;
    }
    if (outerRef.current) {
      outerRef.current.style.borderColor = color;
    }
  }, [currentTheme]);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[9999] rounded-full border-2 transition-[width,height,background-color,border-color,opacity] duration-150"
        style={{
          width: 32,
          height: 32,
          top: 0,
          left: 0,
          marginLeft: '-16px',
          marginTop: '-16px',
          willChange: 'transform',
          borderColor: 'var(--t-cursor-color, #FFE500)',
        }}
      />
      <div
        ref={innerRef}
        className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height] duration-100"
        style={{
          width: 8,
          height: 8,
          top: 0,
          left: 0,
          marginLeft: '-4px',
          marginTop: '-4px',
          willChange: 'transform',
          backgroundColor: 'var(--t-cursor-color, #FFE500)',
        }}
      />
    </>
  );
};

export default CustomCursor;
