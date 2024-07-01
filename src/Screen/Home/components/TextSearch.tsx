export const TextSearch = () => {
  return (
    <div className="flex flex-col gap-y-8 items-center">
      <h2 className="text-2xl">Expore the Infinite</h2>
      <p>
        every text that can ever be written is in the Archive. Search for it
        here:
      </p>
      <textarea
        className="textarea textarea-accent w-full max-w-md"
              placeholder="Search"
              rows={10}
          ></textarea>
        <button className="btn btn-accent">Go</button>
    </div>
  );
};
