import type { Archetype } from '@/lib/archetypes';

interface ResultCardProps {
  archetype: Archetype;
  /** Use when rendering for export (fixed size, no responsive scaling) */
  forExport?: boolean;
}

const CARD_WIDTH = 600;
const CARD_HEIGHT = 315; // ~1.91:1

export function ResultCard({ archetype, forExport }: ResultCardProps) {
  const isExport = forExport === true;

  return (
    <div
      className="bg-[hsl(40,20%,96%)] text-[hsl(220,10%,15%)] overflow-hidden rounded-sm border border-[hsl(40,10%,85%)]"
      style={
        isExport
          ? {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              fontFamily: "'Playfair Display', Georgia, serif",
            }
          : undefined
      }
    >
      <div
        className="flex flex-col h-full p-8 justify-between"
        style={isExport ? { padding: 32 } : undefined}
      >
        {/* Neutral abstract visual: simple geometric shapes */}
        <div className="flex items-center justify-center gap-3 opacity-40">
          <div
            className="rounded-full border-2 border-[hsl(220,10%,25%)]"
            style={isExport ? { width: 40, height: 40 } : { width: 32, height: 32 }}
          />
          <div
            className="border border-[hsl(220,10%,25%)]"
            style={isExport ? { width: 48, height: 24 } : { width: 40, height: 20 }}
          />
          <div
            className="rounded-full border-2 border-[hsl(220,10%,25%)]"
            style={isExport ? { width: 24, height: 24 } : { width: 20, height: 20 }}
          />
        </div>

        <div className="space-y-2">
          <p
            className="text-xs uppercase tracking-widest text-[hsl(220,8%,45%)]"
            style={isExport ? { fontSize: 11 } : undefined}
          >
            Curiosity Assessment
          </p>
          <h2
            className="font-serif font-medium tracking-tight text-[hsl(220,10%,15%)]"
            style={isExport ? { fontSize: 28 } : undefined}
          >
            {archetype.name}
          </h2>
          <p
            className="text-xs italic text-[hsl(220,8%,40%)]"
            style={isExport ? { fontSize: 10 } : undefined}
          >
            {archetype.tagline}
          </p>
          <p
            className="text-sm leading-relaxed text-[hsl(220,8%,45%)] max-w-md"
            style={isExport ? { fontSize: 14 } : undefined}
          >
            {archetype.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export const RESULT_CARD_WIDTH = CARD_WIDTH;
export const RESULT_CARD_HEIGHT = CARD_HEIGHT;
