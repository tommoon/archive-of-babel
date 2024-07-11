import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const [formValues, setFormValues] = useState({
    x: "0",
    y: "0",
    z: "0",
    unit: '',
    cabinet: '',
    row: '',
    book: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Adjust the value for specific fields
    let adjustedValue = value;
    if (['unit', 'cabinet', 'row', 'book'].includes(name) && value !== '') {
      adjustedValue = (parseInt(value)).toString();
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: adjustedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     const queryParams = Object.entries(formValues)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}=${['unit', 'cabinet', 'row', 'book'].includes(key) ? parseInt(value) - 1 : value}`)
       .join("&");
    navigate(`/game?${queryParams}`);
  };
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
            <form className="form-control w-full space-y-2" onSubmit={handleSubmit}>
              <div className="label-text">Location (required)</div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  required
                  placeholder="X"
                  name="x"
                  value={formValues.x}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
                <input
                  required
                  placeholder="Y"
                  name="y"
                  value={formValues.y}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
                <input
                  required
                  placeholder="Z"
                  name="z"
                  value={formValues.z}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent input-sm w-full max-w-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Unit
                  <input
                    type="number"
                    name="unit"
                    value={formValues.unit}
                    onChange={handleInputChange}
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    min={1}
                    max={5}
                  />
                </label>
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Cabinet
                  <input
                    type="number"
                    name="cabinet"
                    value={formValues.cabinet}
                    onChange={handleInputChange}
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
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
                    name="row"
                    value={formValues.row}
                    onChange={handleInputChange}
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    min={1}
                    max={5}
                  />
                </label>
                <label className="input input-bordered input-sm flex items-center gap-2">
                  Book
                  <input
                    type="number"
                    name="book"
                    value={formValues.book}
                    onChange={handleInputChange}
                    className="input input-xs w-full max-w-s px-0 focus:border-transparent max-w-8 ml-auto"
                    max={10}
                    min={1}
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-accent btn-sm">Go</button>
            </form>
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
