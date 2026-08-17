# Archive of Babel

A walkable 3D library that contains every possible page of text — where any phrase you can type already has an exact address, and the app computes it rather than searching for it.

**Live demo → [archiveofbabel.com](https://www.archiveofbabel.com)**

> **[ screenshot / demo GIF goes here ]**
> Save it to `docs/screenshot.png`, then replace this block with:
> `![Archive of Babel](docs/screenshot.png)`
> Suggested clip: walk down a corridor, pull a book off a shelf, then run a
> search and land on the page containing the phrase.

---

## What it does

- **Walk the library** in first person — corridors, staircases and reading rooms, with real collision and physics.
- **Pull any book off any shelf** and read it. Every page is filled with generated text.
- **Search for a phrase** and get taken to the exact book and page that contains it — not a page that resembles it, the one that holds those characters.
- **Share any location** as a URL. Coordinates live entirely in the query string, so a link always reopens the same page of the same book.

Inspired by Jorge Luis Borges' short story *The Library of Babel*.

## Why it's technically interesting

The library is never stored. It is **computed on demand**, and the interesting part is that the computation runs in both directions.

**The alphabet is the number base.** The text uses exactly 32 characters — 26 letters plus `,` `.` `!` `?` `'` and space. That is not a coincidence: it means every character is exactly one base-32 digit, so a page of text *is* a number, and a number *is* a page of text. The whole design falls out of that choice.

**Generation is a reversible bijection, not a hash.** A room's coordinates seed a linear congruential generator; [`makeTextBlock`](src/lib/randomFunctions.ts) walks the base-32 coordinate and shifts each digit by the generator's output to produce characters. [`makeHex`](src/lib/randomFunctions.ts) runs the identical generator and shifts the other way, turning text back into coordinates. Because both directions consume the same seeded stream, they are exact inverses.

**So search is an inversion, not a lookup.** [`findText`](src/lib/randomFunctions.ts) pads your phrase out to a full 3,000-character page, inverts it into coordinates, and hands back a location. Finding a phrase costs the same as generating one — there is no index and nothing to scan. That is what makes an unbounded library searchable at all.

**Coordinates outgrow `Number` immediately.** A 1,000-digit base-32 value is far past `Number.MAX_SAFE_INTEGER`, so room-to-room movement is `BigInt` arithmetic on base-32 strings ([`base32Utils.ts`](src/lib/base32Utils.ts)) rather than ordinary math.

**Rendering stays cheap.** Each room holds 4 cabinets × 5 units × 5 rows × 10 books = 1,000 books, drawn as GPU instances from one geometry, with per-book colour and hover offsets derived from the same seeded RNG. Collision meshes are authored separately from the visible geometry so physics stays cheap.

## Stack

| Layer | Choice |
|---|---|
| UI | React 18, TypeScript, Vite |
| 3D | react-three-fiber, drei, three.js |
| Physics | Rapier (`@react-three/rapier`) |
| State | zustand |
| Styling | Tailwind CSS, daisyUI, shadcn/ui |
| Deploy | Docker (multi-stage) → nginx → Fly.io |

## Run it locally

Requires Node 18+.

```bash
git clone https://github.com/tommoon/archiveOfBabel.git
cd archiveOfBabel
npm install
npm run dev
```

Open <http://localhost:5173>.

| Script | Does |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `src/` |
| `npm run format` | Prettier over `src/` |

### With Docker

```bash
docker build -t archive-of-babel .
docker run -p 8080:8080 archive-of-babel
```

## Project structure

```
src/
├── lib/
│   ├── randomFunctions.ts   # ← start here: text generation and its inverse
│   ├── base32Utils.ts       # BigInt base-32 coordinate arithmetic
│   └── utils.ts             # coordinate/room helpers
├── Controllers/             # zustand stores (game, options, touch input)
├── Screen/                  # routed screens — Home, Game, and static pages
├── props/                   # 3D room contents (books, cabinets, stairs)
├── hooks/                   # useQueryString bridges URL ↔ game state
└── assets/                  # models, sounds, images
```

The URL is the save file: `x`, `y`, `z` locate the room, `cabinet`/`unit`/`row`/`book` locate the book, and `page` the page.

## Credits

- *The Library of Babel* by Jorge Luis Borges — the original idea.
- [libraryofbabel.info](https://libraryofbabel.info/) by Jonathan Basile — the first digital version.
- [Library-Of-Pybel](https://github.com/cakenggt/Library-Of-Pybel) — reference for the text-generation approach.
- Models: [Modular Temple Pack](https://fertile-soil-productions.itch.io/temple-modular-collection) by Fertile Soil Productions.
- Sound: [Zapsplat](https://www.zapsplat.com/). Images: [Freepik](https://www.freepik.com/).

## License

Source code is [MIT](LICENSE). Bundled models, audio and images are third-party assets under their own licenses — see [LICENSE](LICENSE) and the credits above.
