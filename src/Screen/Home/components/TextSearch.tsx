import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

export const TextSearch: React.FC = () => {
  const [text, setText] = useState<string>("");
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="flex flex-col gap-y-8 items-center">
      <h2 className="text-2xl">Explore the Infinite</h2>
      <p>
        Every text that can ever be written is in the Archive. Search for it
        here:
      </p>
      <form>
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
          Go
        </Link>}
      </form>
    </div>
  );
};
