import { About } from "./components/About";
import { Background } from "./components/Background";
import { Container } from "./components/Container";
import { Hero } from "./components/Hero";
import { TextSearch } from "./components/TextSearch";

export const Home = () => {
  return (
    <>
      <Background />
      <div className="space-y-[50vh]">
        <Hero />
        <Container>
          <TextSearch />
        </Container>
        <Container>
          <About />
        </Container>
      </div>
    </>
  );
};
