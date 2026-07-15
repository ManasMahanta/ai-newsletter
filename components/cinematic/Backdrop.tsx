// Site-wide ambient backdrop, fixed behind all content on every page:
// an oscilloscope-style measurement grid, slow-drifting signal glows, and
// a film-grain layer — literal noise, for a site called Signal & Noise.
// Pure CSS/SVG (styles in globals.css), zero network requests.

export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="backdrop-grid absolute inset-0" />
      <div className="backdrop-orb absolute -top-40 left-[8%] h-[34rem] w-[34rem] bg-indigo-500/12 dark:bg-indigo-500/10" />
      <div
        className="backdrop-orb absolute top-[35%] -right-52 h-[30rem] w-[30rem] bg-violet-500/10 dark:bg-violet-500/8"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="backdrop-orb absolute -bottom-56 left-[30%] h-[36rem] w-[36rem] bg-indigo-400/8 dark:bg-indigo-400/7"
        style={{ animationDelay: "-18s" }}
      />
      <div className="backdrop-grain absolute inset-0" />
    </div>
  );
}
