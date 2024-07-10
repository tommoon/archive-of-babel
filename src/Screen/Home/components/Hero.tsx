import { Link } from "react-router-dom";

export const Hero = () => (
  <div className="hero min-h-screen block">
    <div
      className="hero-content 
      text-center      
      backdrop-blur-md
      rounded-lg
      w-full 
      max-w-full
      "
    >
      <div className="max-w-md m-20 sm:m-48 flex flex-col gap-y-12">
        <h1 className="text-5xl sm:text-8xl font-bold">
          Dive into the Archive
        </h1>
        <p>
          Discover a vast library where every book ever written, or that could
          be written, exists. Based on the short story, "The Library of Babel",
          by Jorge Luis Borges.
        </p>
        <Link className="btn btn-accent text-xl" type="button" to={"/game"}>
          Enter
        </Link>
      </div>
    </div>
  </div>
);
