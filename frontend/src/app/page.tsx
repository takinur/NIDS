export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-4xl font-bold text-cyan-400">NIDS-FSL Dashboard</h1>
      <p className="text-gray-400 text-center max-w-lg">
        Network Intrusion Detection System using Few-Shot Learning with Siamese
        Neural Networks — CICIDS2017 dataset.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-4">
        <StatCard title="Model" value="Siamese Network" />
        <StatCard title="Dataset" value="CICIDS2017" />
        <StatCard title="Approach" value="Few-Shot Learning" />
      </div>

      {/* TODO: Add TrafficForm, ResultCard, MetricsChart components */}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <p className="text-xs text-gray-500 uppercase tracking-widest">{title}</p>
      <p className="text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
