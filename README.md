# fictionary

## Summary

Have you ever wanted to use a dictionary or hashmap in JavaScript or TypeScript? Well keep dreaming, but this module will let you pretend you have one!

The fake dictionary (`HackMap`) is implemented as an immutable, flat object with typed, generic accessors. This allows for easier debugging and serialization.
Since it is immutable, all changes result in a new `HackMap` object.
Additionally, it is available as a _mutable_ class wrapped around the `HackMap` object, with accessor functions bound to the wrapper instance in the constructor.

## Installation 

```bash
> npm install fictionary
```

## Motivation

When using Redux for complex apps, our team has run into the need for multiple hashmaps.
We needed to be able to store objects and retrieve them quickly. We also wanted to use Redux's built-in serialization for things like ReduxDevTools.
Since we are using TypeScript, we could place reasonable guards around flat objects and use them. This module is the result of our formalizing these guard functions for our entity objects in Redux.

## Examples

### Using methods with immutable flat objects

```ts
import * as f from "fictionary";

let map = f.emptyHackMap<string>();
// map is {}

map = f.setValue(map)("foo")("bar");
// map is { foo: "bar" }

const foo = f.getValue(map)("foo");
// -> "bar"

const willBeUndefined = f.getValue(map)("yarg");
// -> undefined
```

### Using HackMapper for types which have a key

Some types lend themselves to storing in a map by a key, often an ID field.  To facilitate this, there is a HackMapper interface, which uses a user-provided `getKey` function to extract the string key from objects.

Given a type like:
```ts
export type Book = {
  isbn: string;
  title: string;
  authorLastName: string;
};
```

a function to get the ISBN like
```ts
const getIsbn = (book: Book) => book.isbn;
```

can be used with a `HackMapper<Book>`
```ts
const bookMapper = f.createHackMapper(getIsbn);
let map = f.emptyHackMap<Book>();

map = bookMapper.setValue(map)({
  isbn: "9781974305032",
  title: "Moby Dick or The Whale",
  authorLastName: "Melville"
});
```

#### Compound keys

The key of an object does not have to be a single string field.  Compound keys can created and used with `HackMapper` by using a `getKey` function which concats the required properties.

```ts
export type Organism = {
  genus: string;
  species: string;
  extint: boolean;
}

const getCompoundKey = (organism: Organism) => `${organism.genus} ${organism.species}`;
```

## Contributing

Feel free to make a pull request if the spirit moves you.

This module was created by [@not-mike-smith](https://github.com/not-mike-smith) who barely-didn't-plagiarize code written by [@TheWix](https://github.com/TheWix)
