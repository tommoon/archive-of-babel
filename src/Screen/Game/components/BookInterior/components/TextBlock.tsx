import { generateSeededText } from "@/lib/randomFunctions";
import { useLayoutEffect, useRef, useState } from "react";

type TextBlockProps = {
  seed: string;
};

export const TextBlock: React.FC<TextBlockProps> = ({ seed }) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<number | undefined>(undefined);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (blockRef.current) {
      const height = blockRef.current.clientHeight; // Use clientHeight instead of offsetHeight
      const width = blockRef.current.clientWidth; // Use clientWidth instead of offsetWidth
      const lineHeight = 16; // Assuming 20px line height
      const charWidth = 8; // Assuming 10px per character for a monospaced font

      // Calculate number of lines
      const numberOfLines = Math.floor(height / lineHeight);
      setLines(numberOfLines);

      // Calculate max characters per line
      const maxChars = Math.floor(width / charWidth);
      setMaxCharsPerLine(maxChars);
    }
  }, [blockRef.current]);

  return (
    <div ref={blockRef} className="grow whitespace-pre-wrap w-full h-full overflow-hidden">
      {generateSeededText(`${seed}`, maxCharsPerLine, lines)}
    </div>
  );
};
