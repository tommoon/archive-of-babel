import { useResetPosition } from "@/hooks/useResetPosition";
import { Container } from "./components/Container";
import ReactMarkdown from 'react-markdown';

const styles = {
    h1: {
    marginTop: '2em',
      marginBottom:'1em',
      fontSize: '2.5em',
    },
    h2: {
        marginTop:'1.5em',
      fontSize: '2em',
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
};
  
export const TextPage: React.FC<{ markdownContent: string }> = ({ markdownContent }) => {
  
  useResetPosition()

  return <div className="pt-16 m-auto max-w-prose text-base"
        style={{
        fontSize:'unset'
        }}>
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
            }}
            />
        </Container>
    </div>}
