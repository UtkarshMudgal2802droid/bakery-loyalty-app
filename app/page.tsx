import PrivyComponent from "../components/PrivyComponent";
import { Typography } from "../components/ui/Typography";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-emerald)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-copper)]/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex flex-col items-center justify-center w-full max-w-lg z-10 relative">
        <div className="mb-10 text-center">
          <Typography variant="h1" className="mb-3">Authentication</Typography>
          <Typography variant="p" className="max-w-md mx-auto">
            Establish your cryptographic identity seamlessly to access your loyalty rewards.
          </Typography>
        </div>

        <div className="w-full">
          <PrivyComponent />
        </div>
      </main>
    </div>
  );
}
