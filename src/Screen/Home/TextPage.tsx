import { useResetPosition } from "@/hooks/useResetPosition";
import { Container } from "./components/Container";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet, HelmetProvider } from "react-helmet-async";

type TextPageProps = {
  markdownContent: string,
  helmetContents?: {
    title: string,
    description: string,
    keywords: string
  } | null 
}
const styles = {
  h1: {
    marginTop: '2em',
    marginBottom: '1em',
    fontSize: '2.5em',
    lineHeight: '3rem', 
  },
  h2: {
    marginTop: '1.5em',
    fontSize: '2em',
    lineHeight: '2.5rem',
  },
  p: {
    fontSize: '1em',
    margin: '10px 0',
  },
  ul: {
    margin: '10px 0',
    paddingLeft: '20px',
  },
  li: {
    marginBottom: '5px',
  },
  a: {
    color: '#fff',
    textDecoration: 'none',
  },
  'a:hover': {
    textDecoration: 'underline',
  },
  code: {
    backgroundColor: '#2d2d2d',
    padding: '0.2em 0.4em',
    borderRadius: '4px',
    color: '#c5c8c6',
  },
};

export const TextPage: React.FC<TextPageProps> = ({ markdownContent, helmetContents = null }) => {
  
  useResetPosition();

  return (
    <HelmetProvider>
      {helmetContents && <Helmet>
        <title>{helmetContents.title}</title>
      <meta name="description" content={helmetContents.description} />
      <meta name="keywords" content={helmetContents.keywords} />
      </Helmet>}
    <div
      className="pt-16 m-auto md:max-w-screen-md max-w-full text-base"
      style={{ fontSize: 'unset' }}
    >
      <Container>
        <ReactMarkdown
          children={markdownContent}
          components={{
            h1: ({ ...props }) => <h1 style={styles.h1} {...props} />,
            h2: ({ ...props }) => <h2 style={styles.h2} {...props} />,
            p: ({ ...props }) => <p style={styles.p} {...props} />,
            ul: ({ ...props }) => <ul style={styles.ul} {...props} />,
            li: ({ ...props }) => <li style={styles.li} {...props} />,
            a: ({ ...props }) => <a style={styles.a} {...props} />,
            code: ({ ...props }) => 
              // @ts-expect-error - react-markdown's code renderer props do not line up with SyntaxHighlighter's
                <SyntaxHighlighter style={dark} language="javascript" {...props} />
          }}
        />
      </Container>
      </div>
      </HelmetProvider>
  );
};
