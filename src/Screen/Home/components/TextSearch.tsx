import React, { useState, ChangeEvent, FormEvent } from "react";
import { findText } from "@/lib/randomFunctions";
import { useNavigate } from "react-router-dom";

export const TextSearch: React.FC = () => {
  const [text, setText] = useState<string>("");
const navigate = useNavigate()
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookLoc = findText(text); // Call the findText function with the textarea value
    const searchParams = new URLSearchParams();
    Object.entries(bookLoc).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    navigate(`/game?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-y-8 items-center">
      <h2 className="text-2xl">Explore the Infinite</h2>
      <p>
        Every text that can ever be written is in the Archive. Search for it
        here:
      </p>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-accent">Go</button>
      </form>
    </div>
  );
};
