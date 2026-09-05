import PrivyComponent from "../components/PrivyComponent";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 font-sans p-6">
      <main className="flex flex-col items-center justify-center w-full max-w-lg">
        
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
          Welcome
        </h1>
        
        <p className="text-zinc-400 mb-8 text-center">
          Sign in to access your account.
        </p>

        <div className="w-full">
          <PrivyComponent />
        </div>

      </main>
    </div>
  );
}
