# fictionary

__N.B.__ This code is missing tests, and so is still published as version 0.x

## Summary

Have you ever wanted to use a dictionary or hashmap in JavaScript or TypeScript? Well keep dreaming, but this module will let you pretend you have one!

The fake dictionary (`HackMap`) is implemented as an immutable, flat object with typed, generic accessors. This allows for easier debugging and serialization.
Since it is immutable, all changes result in a new `HackMap` object.
Additionally, it is available as a _mutable_ class wrapped around the `HackMap` object, with accessor functions bound to the wrapper instance in the constructor.

## Motivation

When using Redux for complex apps, our team has run into the need for multiple hashmaps.
We needed to be able to store objects and retrieve them quickly. We also wanted to use Redux's built-in serialization for things like ReduxDevTools.
Since we are using TypeScript, we could place reasonable guards around flat objects and use them. This module is the result of our formalizing these guard functions for our entity objects in Redux.

## Examples

__TODO__

Sorry, I haven't gotten to this yet.  If you check this after 31 Aug. 2019 and there still aren't examples, I owe you a coffee/beer

## Contributing

Feel free to make a pull request if the spirit moves you.

This module was created by [@not-mike-smith](https://github.com/not-mike-smith) who barely-didn't-plagiarize code written by [@TheWix](https://github.com/TheWix)
