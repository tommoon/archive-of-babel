import { useSearchParams } from "react-router-dom";
import { About } from "./components/About";
import { Container } from "./components/Container";
import { Hero } from "./components/Hero";
import { TextSearch } from "./components/TextSearch";
import { useEffect } from "react";
import { gameController } from "@/Controllers/gameController";
import { useResetPosition } from "@/hooks/useResetPosition";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const Home = () => {
  const [, setSearchParams] = useSearchParams();
  const { setCellHex, setBookState, setPage } = gameController();
  useResetPosition()
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
    <HelmetProvider>
      <Helmet>
      <title>Archive of Babel</title>
      <meta name="description" content="Based on the Library of babel by Louis Borges." />
      <meta name="keywords" content="Library of babel, online game, infinity" />
        </Helmet>
    <div className="space-y-[50vh]">
    <Hero />
        <Container>
          <TextSearch />
        </Container>
        <Container>
          <About />
        </Container>
        </div>
      </HelmetProvider>
  );
};
