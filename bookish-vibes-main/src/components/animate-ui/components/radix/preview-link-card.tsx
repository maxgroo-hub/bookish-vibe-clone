import React, { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface PreviewLinkCardContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  href: string;
  followCursor?: boolean | "x" | "y";
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}

const PreviewLinkCardContext = createContext<PreviewLinkCardContextValue>(
  {} as PreviewLinkCardContextValue
);

interface PreviewLinkCardProps {
  href: string;
  followCursor?: boolean | "x" | "y";
  children: React.ReactNode;
  className?: string;
}

export function PreviewLinkCard({
  href,
  followCursor = false,
  children,
  className,
}: PreviewLinkCardProps) {
  const [open, setOpen] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 260, damping: 24 });
  const springY = useSpring(cursorY, { stiffness: 260, damping: 24 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!followCursor) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      if (followCursor === true || followCursor === "x") cursorX.set(relX - rect.width / 2);
      if (followCursor === true || followCursor === "y") cursorY.set(relY);
    },
    [followCursor, cursorX, cursorY]
  );

  return (
    <PreviewLinkCardContext.Provider value={{ open, setOpen, href, followCursor, springX, springY }}>
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>
    </PreviewLinkCardContext.Provider>
  );
}

interface PreviewLinkCardTriggerProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export function PreviewLinkCardTrigger({
  children,
  className,
  ...props
}: PreviewLinkCardTriggerProps) {
  const { href } = useContext(PreviewLinkCardContext);
  return (
    <a href={href} className={cn("block", className)} {...props}>
      {children}
    </a>
  );
}

interface PreviewLinkCardContentProps {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  target?: string;
  children: React.ReactNode;
}

export function PreviewLinkCardContent({
  side = "top",
  sideOffset = 12,
  align = "center",
  children,
}: PreviewLinkCardContentProps) {
  const { open, followCursor, springX } = useContext(PreviewLinkCardContext);

  const alignStyle: React.CSSProperties =
    align === "center"
      ? { left: "50%", translateX: "-50%" }
      : align === "start"
      ? { left: 0 }
      : { right: 0 };

  const positionStyle: React.CSSProperties =
    side === "top"
      ? { bottom: `calc(100% + ${sideOffset}px)` }
      : { top: `calc(100% + ${sideOffset}px)` };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: side === "top" ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: side === "top" ? 8 : -8 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          style={{
            ...positionStyle,
            ...(followCursor && align === "center" ? { left: "50%", x: springX } : alignStyle),
            translateX: followCursor && align === "center" ? "-50%" : undefined,
          } as React.CSSProperties}
          className="absolute z-50 w-60 overflow-hidden rounded-lg brutal-border bg-background shadow-2xl pointer-events-none"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PreviewLinkCardImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function PreviewLinkCardImage({ src, alt = "Preview", className }: PreviewLinkCardImageProps) {
  return (
    <div className={cn("w-full h-36 overflow-hidden bg-muted", className)}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}
