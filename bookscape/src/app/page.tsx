import UnifiedSearchBar from '@/components/UnifiedSearchBar';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">BookScape</h1>
          <p className="text-xl text-gray-300">Discover the world within every book</p>
        </div>
        <UnifiedSearchBar />
      </div>
    </div>
  );
}
