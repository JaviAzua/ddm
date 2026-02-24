import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  /** Tamaño del icono (Tailwind): ej. "h-6 w-6" */
  className?: string;
  /**
   * Largo de cada línea como ratio 0–1 (centradas).
   * 1 = a todo lo ancho; valores menores = más cortas.
   */
  lineLengthTop?: number;
  lineLengthMiddle?: number;
  lineLengthBottom?: number;
  /**
   * Color de las líneas. Por defecto "currentColor" (heredado de className/padre).
   * Puedes usar hex, rgb, o nombres. Para cada línea por separado usa colorTop/Middle/Bottom.
   */
  color?: string;
  colorTop?: string;
  colorMiddle?: string;
  colorBottom?: string;
};

const LINE_Y = { top: 7, middle: 12, bottom: 17 } as const;
const FULL_LENGTH = 16;
const MARGIN = 4;

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

function lineToPath(y: number, ratio: number) {
  const length = clamp(ratio) * FULL_LENGTH;
  const offset = (FULL_LENGTH - length) / 2;
  const x1 = MARGIN + offset;
  const x2 = MARGIN + FULL_LENGTH - offset;
  return `M${x1} ${y}H${x2}`;
}

function BurguerMenuIcon({
  className,
  lineLengthTop = 1,
  lineLengthMiddle = 1,
  lineLengthBottom = 1,
  color,
  colorTop,
  colorMiddle,
  colorBottom,
  ...svgProps
}: Props) {
  const defaultStroke = color ?? "currentColor";
  const lines = [
    {
      d: lineToPath(LINE_Y.top, lineLengthTop),
      stroke: colorTop ?? defaultStroke,
    },
    {
      d: lineToPath(LINE_Y.middle, lineLengthMiddle),
      stroke: colorMiddle ?? defaultStroke,
    },
    {
      d: lineToPath(LINE_Y.bottom, lineLengthBottom),
      stroke: colorBottom ?? defaultStroke,
    },
  ] as const;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      aria-hidden
      {...svgProps}
    >
      {lines.map(({ d, stroke }, i) => (
        <path key={i} d={d} stroke={stroke} />
      ))}
    </svg>
  );
}

export default BurguerMenuIcon;
