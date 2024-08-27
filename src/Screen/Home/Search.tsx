import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container } from "./components/Container";
import { findText } from "@/lib/randomFunctions";
import { useResetPosition } from "@/hooks/useResetPosition";
import { characters } from "./components/TextSearch";

export const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchString, setSearchString] = useState<string | undefined>('')
    const [textString, setTextString] = useState<string | undefined>('')
    
    useResetPosition();

    useEffect(() => { 
        const searchstring = searchParams.get("searchstring");
        setSearchString(searchstring || '')
        setTextString(searchstring || '')
    }, [])
    
    const updateSearchString = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length > 3000) return

        const formattedText = e.target.value.toLowerCase()
        if(formattedText.split('').every(letter => characters.includes(letter))){
            setTextString(formattedText);
          }
    }

    const handleSubmit = () => {
        if(!textString) return
        setSearchParams({searchstring: textString});
        setSearchString(textString);
    }

    const exactMatch = useMemo(() => {
        if (!searchString) return null;
        const bookLoc = findText(searchString);
        const searchParams = new URLSearchParams();
        Object.entries(bookLoc).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
        searchParams.append('searchString', searchString.toString());
        return searchParams;
    }, [searchString]);

    const partialMatches = useMemo(() => {
        if (!searchString) return null;
        return [0, 1, 2].map(() => {
            const bookLoc = findText(searchString, false);
            const searchParams = new URLSearchParams();
            Object.entries(bookLoc).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value.toString());
                }
            });
            searchParams.append('searchString', searchString.toString());
            return searchParams;
        })
    }, [searchString]);

    return (
        <div className="pt-16 m-auto max-w-prose text-base flex flex-col gap-y-8">
            <Container>
                <div className="flex flex-col gap-y-8">
                    <h1 className="mx-auto text-center text-3xl mt-8 mb-4 font-bold">Search</h1>
                    <textarea
                        autoFocus={false}
                        rows={20}
                        className="w-full p-8 text-[16px]"
                        value={textString}
                        onChange={updateSearchString}
                        maxLength={3000}
                    />
                    <div className="flex justify-between">
                        <button disabled={textString !== undefined && textString.length <= 0} onClick={handleSubmit} className="btn btn-accent text-lg p-2 btn-lg">Search</button>
                        {textString && textString.length && <span>{`${textString.length}/3000 characters`}</span>}
                    </div>
                </div>
            </Container>
            {searchString && exactMatch && (
                <>
                    <h2 className="m-auto text-xl">Exact Match</h2>
                        <Link className="btn btn-accent truncate max-w-full text-left justify-start text-xs h-fit p-4" to={`/game?${exactMatch.toString()}`}>
                            <div className="flex flex-col">
                                {Array.from(exactMatch.entries()).map(([key, value]) => {
                                    return (
                                <div className="" key={key}>
                                    {`${key}: ${value}`}
                                </div>
                                )})}
                            </div>
                    </Link>
                </>
            )}
            {
                searchString &&
                partialMatches &&
                <h2 className="m-auto text-xl">Partial Matches</h2>
            }
            {
                searchString &&
                partialMatches &&
                partialMatches.map((match,i) =>
                    <Link key={i} className="btn btn-accent truncate max-w-full text-left justify-start text-xs h-fit p-4" to={`/game?${match.toString()}`}>
                        <div className="flex flex-col">
                            {Array.from(match.entries()).map(([key, value]) => {
                                return (
                            <div className="" key={key}>
                                {`${key}: ${value}`}
                            </div>
                            )})}
                        </div>
                    </Link>
                )
            }
        </div>
    );
}
