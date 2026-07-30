import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full bg-background text-foreground px-4 py-16">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-center uppercase leading-tight mb-6">
        Bug everywhere <br /> Fix everytime.
      </h1>

      <p className="text-muted-foreground text-sm md:text-base text-center max-w-2xl mb-10 leading-relaxed">
        Crafting scalable software through the lens of clean architecture.{" "}
        <br className="hidden md:block" />
        High-performance code for an era of sophisticated digital experiences.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          to="/projects"
          className="flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors hover:bg-primary/90"
        >
          The Projects
        </Link>

        <Link
          to="/vision"
          className="flex items-center justify-center bg-transparent border border-foreground text-foreground px-8 py-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
        >
          Our Vision
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
