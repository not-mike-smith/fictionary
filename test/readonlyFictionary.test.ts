import "jest";
import { none } from "fp-ts/lib/Option";
import { Organism, human, dog, direwolf, scientificName } from "./organism";
import { ReadonlyFictionary, emptyHackMap, createHackMapper } from "../src/index";

let fict: ReadonlyFictionary<Organism>;
const humanName = scientificName(human());
const dogName = scientificName(dog());
const direwolfName = scientificName(direwolf());

test("empty readonly mapped set", () => {
	const ms = new ReadonlyFictionary<Organism>(scientificName);
	expect(ms).not.toBeUndefined();
})

describe("ReadonlyFictionary with non-extinct animals", () => {
	beforeEach(() => {
		let hmap = emptyHackMap<Organism>();
		let hmapper = createHackMapper(scientificName);
		hmap = hmapper.setValue(hmap)(human());
		hmap = hmapper.setValue(hmap)(dog());
		fict = new ReadonlyFictionary<Organism>(scientificName, hmap);
	});

	test("containsKey", () => {
		expect(fict.containsKey(humanName)).toBe(true);
		expect(fict.containsKey(direwolfName)).toBe(false);
	});

	test("contains", () => {
		expect(fict.contains(human())).toBe(true);
		expect(fict.contains(direwolf())).toBe(false);
	});

	test("get", () => {
		const humanOption = fict.get(humanName);
		expect(humanOption._tag).toBe("Some");
		expect(fict.get(direwolfName)).toBe(none);
	});

	test("getValue", () => {
		const _human = fict.getValue(humanName);
		expect(_human).not.toBeUndefined();
		expect(_human!.genus).toBe(human().genus);
		expect(_human!.species).toBe(human().species);
		expect(fict.getValue(direwolfName)).toBeUndefined();
	});

	test("keys", () => {
		const keys = fict.keys;
		expect(keys.length).toBe(2);
		expect(keys.indexOf(humanName)).toBeGreaterThanOrEqual(0);
		expect(keys.indexOf(dogName)).toBeGreaterThanOrEqual(0);
	});

	test("values", () => {
		const values = fict.values;
		expect(values.length).toBe(2);
		expect(values.find(o => o.genus === human().genus && o.species === human().species)).not.toBeUndefined();
		expect(values.find(o => o.genus === dog().genus && o.species === dog().species)).not.toBeUndefined();
	});

	test("pairs", () => {
		const pairs = fict.pairs;
		expect(pairs.length).toBe(2);
		const foundHuman = pairs.find(p => p.key === humanName);
		const foundDog = pairs.find(p => p.key === dogName);
		expect(foundHuman).not.toBeUndefined();
		expect(foundDog).not.toBeUndefined();
		expect(foundHuman!.value.genus).toBe(human().genus);
		expect(foundHuman!.value.species).toBe(human().species);
		expect(foundDog!.value.genus).toBe(dog().genus);
		expect(foundDog!.value.species).toBe(dog().species);
	});

	test("length", () => {
		expect(fict.length).toBe(2);
	})

	test("copy", () => {
		const copy = fict.copy();
		expect(copy).not.toBe(fict);
		expect(copy.containsKey(humanName)).toBe(true);
		expect(copy.containsKey(dogName)).toBe(true);
		expect(copy.containsKey(direwolfName)).toBe(false);
	});
});
