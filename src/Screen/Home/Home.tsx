import { useSearchParams } from "react-router-dom";
import { About } from "./components/About";
import { Container } from "./components/Container";
import { Hero } from "./components/Hero";
import { TextSearch } from "./components/TextSearch";
import { useEffect } from "react";
import { gameController } from "@/Controllers/gameController";
import { useResetPosition } from "@/hooks/useResetPosition";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import image from '@/assets/images/standinbackground.png';
import { AdSenseAd } from "./components/AdSenseAd";

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
      <title>Archive of Babel - the playable recreation of the short story 'The Library of Babel' by Jorge Louis Borges</title>
      <meta name="description" content="A browser based 3D game that can be played for free on mobile and desktop. Wonder the endless Library reading the books, searching for esoteric knowledge." />
        <meta name="keywords" content="Library of babel, online game, infinity" />
        <meta property="og:title" content="The Archive of Babel"/>
        <meta property="og:title" content="website"/>
        <meta property="og:url" content="https://www.archiveofbabel.com"/>
        <meta property="og:image" content={image} />
        <meta property="og:description" content='An infinite library to explore in browser, on mobile or desktop. Based on the short story "The Library of Babel" by Jorge Louis Borges.' />
        <meta property="og:determiner" content="the"/>
        <meta property="og:locale" content="en_GB"/>
        </Helmet>
    <div className="space-y-[50vh]">
    <Hero />
        <Container>
          <TextSearch />
        </Container>
        <AdSenseAd dataAdSlot="6092205678"/>
        <Container>
          <About />
        </Container>
        </div>
      </HelmetProvider>
  );
};
