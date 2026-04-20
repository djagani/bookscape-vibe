import Link from 'next/link';
import type { World } from '@/lib/types';

export default function WorldCard({ world }: { world: World }) {
  const interp = world.interpretation;

  return (
    <Link href={`/world/${world.id}`}>
      <div
        className="p-6 rounded-lg cursor-pointer hover:opacity-80 transition min-h-48 flex flex-col justify-between"
        style={{ backgroundColor: interp.vibeColor, color: interp.textColor }}
      >
        <div>
          <div className="text-4xl mb-3">{interp.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{world.bookTitle}</h2>
          <p className="text-sm opacity-75">{world.author}</p>
        </div>
        <div>
          <p className="text-xs opacity-60">
            {new Date(world.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
