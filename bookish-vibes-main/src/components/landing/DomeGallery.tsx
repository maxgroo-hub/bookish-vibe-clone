import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export interface DomeItem {
  title: string;
  author: string;
  genre: string;
  rating: number;
  color: string;
  days: number;
  imageUrl: string;
}

interface HoverCard {
  item: DomeItem;
  x: number;
  y: number;
}

interface DomeGalleryProps {
  items: DomeItem[];
  radius?: number;
  nItems?: number;
  dragDampening?: number;
  grayscale?: boolean;
}

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

function getFibonacciSpherePositions(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi = (2 * Math.PI * i) / GOLDEN_RATIO;
    const xRot = 90 - (theta * 180) / Math.PI;
    const yRot = (phi * 180) / Math.PI;
    return { xRot, yRot };
  });
}

export function DomeGallery({
  items,
  radius = 250,
  nItems = 30,
  dragDampening = 2,
  grayscale = true,
}: DomeGalleryProps) {
  const [hoverCard, setHoverCard] = useState<HoverCard | null>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const rotYRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>();

  const positions = getFibonacciSpherePositions(nItems);
  const tileCount = Math.ceil(nItems / items.length);
  const tiled = Array.from({ length: tileCount }, () => items).flat().slice(0, nItems);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!isDragging.current) {
        velocityRef.current *= 0.97;
        rotYRef.current += velocityRef.current + 0.1;
      }
      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateY(${rotYRef.current}deg)`;
      }
      if (running) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    velocityRef.current = 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    rotYRef.current += dx / dragDampening;
    velocityRef.current = dx / dragDampening;
    lastX.current = e.clientX;
  }, [dragDampening]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = e.touches[0].clientX;
    velocityRef.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastX.current;
    rotYRef.current += dx / dragDampening;
    velocityRef.current = dx / dragDampening;
    lastX.current = e.touches[0].clientX;
  }, [dragDampening]);

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "900px" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { onMouseUp(); setHoverCard(null); }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        <div
          ref={sphereRef}
          className="w-full h-full"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {tiled.map((item, i) => {
            const { xRot, yRot } = positions[i];
            return (
              <div
                key={`${item.title}-${i}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "108px",
                  height: "138px",
                  marginTop: "-69px",
                  marginLeft: "-54px",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${yRot}deg) rotateX(${xRot}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  willChange: "filter",
                }}
                className={`dome-tile${grayscale ? " dome-grayscale" : ""}`}
                onMouseEnter={(e) => {
                  if (isDragging.current) return;
                  (e.currentTarget as HTMLElement).classList.add("dome-hovered");
                  setHoverCard({ item, x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  if (isDragging.current) { setHoverCard(null); return; }
                  setHoverCard((prev) =>
                    prev?.item.title === item.title && prev?.item.author === item.author
                      ? { ...prev, x: e.clientX, y: e.clientY }
                      : { item, x: e.clientX, y: e.clientY }
                  );
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).classList.remove("dome-hovered");
                  setHoverCard(null);
                }}
              >
                <div className={`${item.color} w-full h-full brutal-border rounded-md overflow-hidden relative cursor-pointer`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent flex flex-col justify-end p-1.5">
                    <p className="text-white font-heading font-black text-[9px] leading-tight line-clamp-2">{item.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-body opacity-50 select-none pointer-events-none z-10">
        drag to rotate · hover to preview
      </p>

      <AnimatePresence>
        {hoverCard && (
          <motion.div
            key={hoverCard.item.title + hoverCard.item.author}
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="brutal-card rounded-lg overflow-hidden bg-background shadow-2xl pointer-events-none"
            style={{
              position: "fixed",
              left: hoverCard.x + 16,
              top: Math.max(80, hoverCard.y - 230),
              width: "210px",
              zIndex: 9999,
            }}
          >
            <div className={`${hoverCard.item.color} h-24 relative`}>
              <span className="absolute top-2 left-2 bg-foreground text-background font-heading font-black text-[9px] px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <Sparkles className="w-2 h-2" /> Just Dropped
              </span>
              <span className="text-[9px] font-heading font-bold opacity-70 absolute top-2 right-2">
                {hoverCard.item.days}d ago
              </span>
              <BookOpen className="w-7 h-7 opacity-20 absolute bottom-2 right-2" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">
                  {hoverCard.item.genre}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-heading font-bold">
                  <Star className="w-2.5 h-2.5 fill-current text-yellow-500" /> {hoverCard.item.rating}
                </span>
              </div>
              <h3 className="font-heading font-black text-sm leading-tight mb-0.5">{hoverCard.item.title}</h3>
              <p className="text-xs text-muted-foreground font-body mb-2.5">{hoverCard.item.author}</p>
              <Link
                to="/dashboard/books"
                className="brutal-btn bg-foreground text-background rounded-md font-heading text-xs w-full inline-flex items-center justify-center gap-1 pointer-events-auto"
              >
                Borrow Now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
