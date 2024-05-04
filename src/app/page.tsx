import ModeToggle from "@/components/dark-mode-toggle";
import MemeTextForm from "@/components/meme-text-form";

export default function Home() {
  return (
    <div className="md:px-64 md:py-28 px-3">
      <div className="mb-4">
        <ModeToggle />
      </div>
      <div>
        Meme Generator
        <MemeTextForm />
      </div>
    </div>
  );
}
