export const About = () => {
  // origins discover learn

  return (
    <div className="grid grid-cols-1 grid-rows-1 place-items-center lg:grid-cols-3 gap-y-16">
      <div className="card h-full bg-base-100 w-80 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Origin</h2>
          <p>
            The archive is based on the short story 'The Library of Babel', by
            Jorge Luis Borges. His library holds an unimaginably vast number of
            books, including every possible combination of letters, spaces, and
            punctuation marks.
          </p>
          <div className="card-actions">
            <button className="btn btn-accent btn-sm">Read More...</button>
          </div>
        </div>
      </div>
      <div className="card h-full bg-base-100 w-80 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Discover</h2>
          <p>
            If you know the location of a book in the Archive, you can go it
            here
          </p>
          <div className="card-actions">
            <form className="form-control w-full space-y-2">
              <div className="label-text">Location (required)</div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  required
                  type="number"
                  placeholder="X"
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
                <input
                  required
                  type="number"
                  placeholder="Y"
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
                <input
                  required
                  type="number"
                  placeholder="Z"
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Unit
                  <input
                    type="number"
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    placeholder="1"
                    min={1}
                    max={4}
                  />
                </label>
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Cabinet
                  <input
                    type="number"
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    placeholder="1"
                    min={1}
                    max={4}
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Row
                  <input
                    type="number"
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    placeholder="1"
                    min={1}
                    max={4}
                  />
                </label>
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Book
                  <input
                    type="number"
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    placeholder="1"
                    max={10}
                    min={1}
                  />
                </label>
              </div>
            </form>
            <button className="btn btn-accent btn-sm">Go</button>
          </div>
        </div>
      </div>
      <div className="card h-full bg-base-100 w-80 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Learn</h2>
          <p>
            The Archive does not actually contain every possible book in
            existence, It actually uses an algorithm to generate each book
            according to its location. A number of technical tricks are used to
            allow the Archive to run smoothly in a modern web browser.
          </p>
          <div className="card-actions">
            <button className="btn btn-accent btn-sm">Read More...</button>
          </div>
        </div>
      </div>
    </div>
  );
};
