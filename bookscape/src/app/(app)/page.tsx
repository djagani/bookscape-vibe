import InputTabs from '@/components/InputTabs';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">BookScape</h1>
          <p className="text-xl text-gray-300">Explore what books feel like</p>
        </div>
        <InputTabs />
      </div>
    </div>
  );
}
