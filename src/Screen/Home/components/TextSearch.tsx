import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

export const characters = "abcdefghijklmnopqrstuvwxyz, .!?'";

export const TextSearch: React.FC = () => {
  const [text, setText] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const formattedText = event.target.value.toLowerCase()
    if(formattedText.split('').every(letter => characters.includes(letter))){
      setText(formattedText);
    }
  };

  return (
    <div className="flex flex-col gap-y-8 items-center">
      <h2 className="text-2xl">Explore the Infinite</h2>
      <p>
        Every text that can ever be written is in the Archive. Search for it
        here:
      </p>
      <form className="max-w-full w-full flex flex-col items-center gap-y-4">
        <textarea
          className="textarea textarea-accent w-full max-w-md"
          placeholder="Search"
          minLength={0}
          required
          maxLength={3000}
          rows={10}
          value={text} 
          onChange={handleChange} 
        ></textarea>
        {text && text.length > 0 && <Link to={`search?searchstring=${text}`} className='btn btn-accent'>
          Search
        </Link>}
      </form>
    </div>
  );
};
