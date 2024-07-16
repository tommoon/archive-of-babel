import React from "react";
import { Container } from "./components/Container";
import { Link } from "react-router-dom";

type ContentsProps = {
  contents: { [key: string]: string }; // Assuming `contents` is an object with string keys and values
  title: string;
};

const extractImage = (markdownText: string): string | null => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdownText.match(imageRegex);
  return match ? match[1] : null;
};

const extractIntroText = (markdown: string): string | null => {
  const regex = /\[Designed by Freepik\]\([^\)]+\)([\s\S]*?)(?=#)/;
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
};

export const Contents: React.FC<ContentsProps> = ({ contents, title }) => {
  return (
    <div className="pt-16 m-auto max-w-prose text-base flex flex-col gap-y-16">
      <Container>
        <h1 className="text-4xl font-bold py-8">{title}</h1>
        <div className="flex flex-col gap-y-8">
          {Object.entries(contents).map(([key, value]) => (
            <Link to={`/tutorials/${key}`} key={key} className="flex gap-8 items-start p-4 bg-black/20 rounded-sm hover:bg-black/40 cursor-pointer transition-colors">
              <div className="flex-shrink-0">
                <img
                  className="w-48 h-32 rounded-md object-cover"
                  src={extractImage(value) || ""}
                  alt={`${key} image`}
                />
                <figcaption className="text-xs text-muted">
                  Designed by <a className="text-accent underline" href="https://www.freepik.com/">freepik</a>
                </figcaption>
              </div>
              <div className="flex flex-col grow">
                <h2 className="text-xl font-bold">{key}</h2>
                <p className="overflow-hidden text-ellipsis max-h-28">
                  {extractIntroText(value)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};
