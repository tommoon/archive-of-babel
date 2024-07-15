import { useSearchParams } from "react-router-dom";
import { About } from "./components/About";
import { Container } from "./components/Container";
import { Hero } from "./components/Hero";
import { TextSearch } from "./components/TextSearch";
import { useEffect } from "react";
import { gameController } from "@/Controllers/gameController";

export const Home = () => {
  const [, setSearchParams] = useSearchParams();
  const { setCellHex, setBookState, setPage } = gameController();
  useEffect(() => {
    setSearchParams({});
    setCellHex({ x: "0", y: "0", z: "0" });
    setPage(0)
    setBookState({
      cabinet: undefined,
      unit: undefined,
      row: undefined,
      book: undefined
    })
  },[])

  return (
    <div className="space-y-[50vh]">
    <Hero />
        <Container>
          <TextSearch />
        </Container>
        <Container>
          <About />
        </Container>
    </div>
  );
};
