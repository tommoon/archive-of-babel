import algorithmImage from "../../assets/images/coding-screen.jpg";

export const algorithm = `# The Algorithms behind the Archive

![code](${algorithmImage})

[Designed by Freepik](https://www.freepik.com/free-photo/computer-program-coding-screen_18415585.htm#query=code&position=2&from_view=keyword&track=sph&uuid=cdd7b65c-adaa-4621-8502-30ef9f11032a)

The complexity behind the archive is just an illusion. The Archive relies on computing power to generate each page.

## How do we do it?

Storing every permutation of every book would require more storage space than you could possibly imagine. So each page of each book is generated pragmatically, using the pages location within the archive. The process is in fact, quite simple. Since we are using 32 different characters, randomly assigned to generate each page. If we generate a string of base32 numbers that is 3000 digits long (then length of the page) we can generate a page.

## Getting started

first we need to build some helper functions:

### Hashing Function

    const  hashCode  = (s:  string) => {
        let  hash  =  0,
    	    i,
    	    chr,
    	    len;
        if (s.length  ==  0) return  hash;
        for (i  =  0, len  =  s.length; i  <  len; i++) {
    	    chr  =  s.charCodeAt(i);
    	    hash  = (hash  <<  5) -  hash  +  chr;
    	    hash  |=  0;
        }
        return  hash;
    };

this simple function is used to generate consistent hash numbers that can be used to seed our linear congruent random number generator.

### Linear Congruent Generator

    type  LCGRandom  = (min?:  number, max?:  number) =>  number;

    function  createLCG(seedString:  string):  LCGRandom {
        const  initialHash  =  MurmurHash3.hash32(seedString);
        let  seed  =  Math.abs(initialHash);
        const  a  =  1664525;
        const  c  =  1013904223;
        const  m  =  2  **  32;

        return (min:  number  =  0, max:  number  =  1):  number  => {
    	    seed  = (a  *  seed  +  c) %  m;
    	    const  normalized  makeTextBlock=  seed  /  m;
    	    return  min  +  normalized  * (max  -  min);
        };
    }

An LCG is a simple pseudo-random number generator. We'll use it to generate a sequence of numbers based on an initial seed provided by the hashing algorithm.

### Normalizing Cell Locations

The Archive exists in 3 dimensions and we can use a cells distance from the origin as part of our unique hash.

Instead of working in base 10 numbers, we work in base32 numbers, where we count up using the base 32 extended hex alphabet. we can simply translate back to base 10 whenever we need human readable numbers.

However we're not going to take into account negative numbers in the location. So we make sure all the cells are normalized:

~~~
type  CellHex  = {
	x:  string;
	y:  string;
	z:  string;
};

const normalizeCell = (cell: CellHex): CellHex => {
	const normalizedCell: CellHex = { ...cell };
	(Object.keys(normalizedCell) as (keyof CellHex)[]).forEach((key) => {
		normalizedCell[key] = normalizedCell[key].replace("-", "");
	});
	return normalizedCell;
};
~~~

### padding numbers

We need numbers of consistent length in our hashes, so lets add a simple padding function:

~~~
const pad = (input: string, length: number, char: string) => {
  return input.padStart(length, char);
};
~~~

### Using Negative Room Values

as mentioned, we don't use negative room numbers in the location hash, however, we can use the number of negative room numbers in the location to compute a different value that can be used as part of the hash:

~~~
const  cellHexToBinary  = (cellHex:  CellHex) =>
	Object.values(cellHex)
		.map((cell) => {
			if (cell.startsWith("-")) {
				return  "0";
			}
			return  "1";
		})
		.join("");

	export  const  roomsToSenary  = (cellHex:  CellHex) => {
		const  binary  =  cellHexToBinary(cellHex);
		return  parseInt(binary, 2);
	};
~~~

and a function that does the reverse:

~~~
const senaryToRooms = (
  senaryNumber: number,
  cellHex: CellHex
): CellHex => {
  const cellKeys = Object.keys(cellHex) as (keyof CellHex)[];
  const numCells = cellKeys.length;
  const binary = senaryNumber.toString(2).padStart(numCells, "0");

  const updatedCellHex: CellHex = { ...cellHex };
  binary.split("").forEach((bit, index) => {
    if (bit === "0") {
      updatedCellHex[cellKeys[index]] = "-" + updatedCellHex[cellKeys[index]];
    } else {
      updatedCellHex[cellKeys[index]] = updatedCellHex[cellKeys[index]];
    }
  });
  return updatedCellHex;
};
~~~

### Finding the Modulus

finally, a modulus function that always returns a positive value can be useful:

~~~
const  modulus  = (t:  number, n:  number):  number  => {
	return ((t  %  n) +  n) %  n;
};
~~~

### characters

We should also declare a CHARACTERS constant. Since we are using base32 numbers to encode The Archive, we can use 32 characters to fill out each of our pages.

~~~
const  CHARACTERS  =  "abcdefghijklmnopqrstuvwxyz, .!?'";
~~~

## Generating Seeded Text

Lets first consider how we can generate seeded text. That is, we pick up a book at a random point in the Archive and open it a random page, and our algorithms generate the text.

### building our LCG

first we need to use our hashcode function to generate a seed for our LCG. we do that by feeding the books location into the function as a string. Remeber, we don't use the room location, only a binary representation of the negative values.
Note: we also pad out the page number, since each book can have 500 pages, if the page number is only say, 3, we need to pad out the number to make 003.

~~~
  const negativeStates = roomsToSenary(bookCell);
  const seed = hashCode(bookLocationCabinet + bookLocationUnit + bookLocationRow + bookLocationBook + pad(page.toString(), 3, "0") + negativeStates)
~~~

since each room in the archive can be mapped using a triplet (floor, row and column) and each page is 3000 characters long, we can use the hex value of each triplet to generate 1000 characters each.

### Generating Text

for each room lets generate text like so:

~~~

const makeTextBlock = (cell: string, seed: string): string => {
  let result = "";
  const lcg = createLCG(seed);
  for (let i = 0; i < cell.split("").length; i++) {
    const index = parseInt(cell[i], 32);
    const rand = lcg(0, CHARACTERS.length);
    const newIndex = modulus(index - Math.floor(rand), CHARACTERS.length);
    const newChar = CHARACTERS[newIndex];
    result += newChar;
  }
  const newHash = hashCode(result);
  const newLcg = createLCG(newHash.toString());
  while (result.length <= 1000) {
    const index = newLcg(0, CHARACTERS.length);
    result += CHARACTERS[Math.floor(index)];
  }

  return result;
};
~~~

lets go through it step by step:

~~~
const makeTextBlock = (cell: string, seed: string): string => {
  let result = "";
  const lcg = createLCG(seed);
~~~

we take the cellHex (floor, row or column) and the hashcode we previously generated as a seed. (We also add the cellHex index to the hash, otherwise each paragraph will be identical). We use this seed to create this paragraphs LCG.

~~~
for (let i = 0; i < cell.split("").length; i++) {
  const index = parseInt(cell[i], 32);
  const rand = lcg(0, CHARACTERS.length);
  const newIndex = modulus(index - Math.floor(rand), CHARACTERS.length);
  const newChar = CHARACTERS[newIndex];
  result += newChar;
}
~~~

once we've got our LCG. we go through the cellLocation string and 'translate' each digit into a character.

~~~
const newHash = hashCode(result);
const newLcg = createLCG(newHash.toString());
while (result.length <= 1000) {
  const index = newLcg(0, CHARACTERS.length);
  result += CHARACTERS[Math.floor(index)];
}
~~~

since each paragraph has to be 1000 characters long, we pad out each paragraph with random characters from our CHARACTERS constant.

we can then cycle through each of our cellHex numbers and pump them through this function to get a complete page of text based on it's location in the archive.

~~~
// we normalize our cells because the negative values are irrelevant and '-' is not part of the base32 hex alphabet
const normalizedCell = normalizeCell(bookCell);

  const text = Object.values(normalizedCell)
    .map((cellNumber, index) => {
      const text = makeTextBlock(
        cellNumber.toString(),
        seed.toString() + index // <- remember to add the cellHex index
      );
      return text;
    })
    .join("");
~~~

joining all this together we get:

~~~

function generateSeededText(bookLocationCabinet, bookLocationUnit, bookLocationRow, bookLocationBook, page) {

	const makeTextBlock = (cell: string, seed: string): string => {
	  let result = "";
	  const lcg = createLCG(seed);
	  for (let i = 0; i < cell.split("").length; i++) {
	    const index = parseInt(cell[i], 32);
	    const rand = lcg(0, CHARACTERS.length);
	    const newIndex = modulus(index - Math.floor(rand), CHARACTERS.length);
	    const newChar = CHARACTERS[newIndex];
	    result += newChar;
	  }
	  const newHash = hashCode(result);
	  const newLcg = createLCG(newHash.toString());
	  while (result.length <= 1000) {
	    const index = newLcg(0, CHARACTERS.length);
	    result += CHARACTERS[Math.fconst makeHex = (blockString: string, seed: string): string => {
  const lcg = createLCG(seed);
  return blockString
    .split("")
    .map((subString: string) => {
      const index = characters.indexOf(subString);
      const rand = lcg(0, characters.length);
      const newIndex = modulus(index + Math.floor(rand), characters.length);
      return newIndex.toString(32);
    })
    .join("");
};loor(index)];
	  }

	  return result;
	};

	 const negativeStates = roomsToSenary(bookCell);
	 const seed = hashCode(bookLocationCabinet + bookLocationUnit + bookLocationRow + bookLocationBook + pad(page.toString(), 3, "0") + negativeStates)

	const normalizedCell = normalizeCell(bookCell);

	const text = Object.values(normalizedCell)
	  .map((cellNumber, index) => {
	    const text = makeTextBlock(
	      cellNumber.toString(),
	      seed.toString() + index
	    );
	    return text;
	  })
	  .join("");

	return text
}
~~~

## Finding a String

what happens if a user wants to find a page in the Archive? Or Search up the location of their name? We need a way to search through all these books and find certain strings...

However since the Archive is technically infinite, it might take a while to search through it.

Instead what we can do is work backwards from the desired string and generate the cellHex we need to find the text that way.

### Building our LCG

Since the Archive is inifinite, we can actually use a random hashcode to seed our LCG

~~~
  const cabinet = Math.floor(Math.random() * 4).toString();
  const unit = Math.floor(Math.random() * 4).toString();
  const row = Math.floor(Math.random() * 4).toString();
  const book = Math.floor(Math.random() * 10).toString();
  const page = pad(Math.floor(Math.random() * 410 + 1).toString(), 3, "0");
  const negativeState = Math.floor(Math.random() * 7);
  const seed = hashCode(cabinet + unit + row + book + page + negativeState);
~~~

we then need to pad the search string using our pad function to make it 3000 characters long

~~~
const  fullString  =  pad(searchString, 3000, " ");
~~~

we then work through the string in blocks of 1000, making a hex value for each paragraph.

~~~
  const newCellHex = { x: "0", y: "0", z: "0" };
  (Object.keys(newCellHex) as (keyof CellHex)[]).forEach((cell, i) => {
    const pos = i * 1000;
    const blockString = fullString.slice(pos, pos + 1000);
    const fullHex = makeHex(blockString, locHash.toString() + i);
    newCellHex[cell] = fullHex;
  });
~~~

Our makeHex function is simply a reversal of our makeTextBlock function

~~~
const makeHex = (blockString: string, seed: string): string => {
  const lcg = createLCG(seed);
  return blockString
    .split("")
    .map((subString: string) => {
      const index = characters.indexOf(subString);
      const rand = lcg(0, characters.length);
      const newIndex = modulus(index + Math.floor(rand), characters.length);
      return newIndex.toString(32);
    })
    .join("");
};
~~~

we can then return the created hex, as well as the randomly generated values for the seed. The full function should look something like this:

~~~
function findText(searchString: string) {

	const makeHex = (blockString: string, seed: string): string => {
	  const lcg = createLCG(seed);
	  return blockString
	    .split("")
	    .map((subString: string) => {
	      const index = characters.indexOf(subString);
	      const rand = lcg(0, characters.length);
	      const newIndex = modulus(index + Math.floor(rand), characters.length);
	      return newIndex.toString(32);
	    })
	    .join("");
	};

	 const cabinet = Math.floor(Math.random() * 4).toString();
	 const unit = Math.floor(Math.random() * 4).toString();
	 const row = Math.floor(Math.random() * 4).toString();
	 const book = Math.floor(Math.random() * 10).toString();
	 const page = pad(Math.floor(Math.random() * 410 + 1).toString(), 3, "0");
	 const negativeState = Math.floor(Math.random() * 7);
	 const seed = hashCode(cabinet + unit + row + book + page + negativeState);

	const fullString = pad(searchString, 3000, " ");
	 const newCellHex = { x: "0", y: "0", z: "0" };
	 (Object.keys(newCellHex) as (keyof CellHex)[]).forEach((cell, i) => {
	   const pos = i * 1000;
	   const blockString = fullString.slice(pos, pos + 1000);
	   const fullHex = makeHex(blockString, locHash.toString() + i);
	   newCellHex[cell] = fullHex;
	 });

	 return {
	   ...senaryToRooms(negativeState, newCellHex),
	   book: book,
	   cabinet: cabinet,
	   row: row,
	   unit: unit,
	   page: page,
	 };
}
~~~

## Conclusion

There we go, with these functions we provided a way to translate a pages location in the Archive into a page of text and a way to reverse it. Much easier than writing and storing each book ;)
`;
