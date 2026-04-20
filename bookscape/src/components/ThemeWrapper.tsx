import type { Interpretation } from '@/lib/types';

interface ThemeWrapperProps {
  interpretation: Interpretation;
  children: React.ReactNode;
}

export default function ThemeWrapper({
  interpretation,
  children,
}: ThemeWrapperProps) {
  return (
    <div
      className="world-wrapper transition-all duration-500"
      style={{
        '--vibe-color': interpretation.vibeColor,
        '--accent-color': interpretation.accentColor,
        '--text-color': interpretation.textColor,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
