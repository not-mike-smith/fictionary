import "jest";
import { some, none } from "fp-ts/lib/Option";
import { Organism, human, dog, direwolf, scientificName } from "./organism";
import MappedSet, { AppendonlyMappedSet } from "../src/index";
import { kMaxLength } from "buffer";

let fict: MappedSet<Organism>;

describe("empty Fictionary", () => {
	beforeEach(() => {
		fict = new MappedSet(scientificName);
	});

	test("set some", () => {
		fict.set(some(human()));
		expect(fict.contains(human())).toBe(true);
	});

	test("set none", () => {
		fict.set(none);
		expect(fict.values.length).toBe(0);
	});

	test("set overwrites", () => {
		fict.set(some(human()));
		const oops = human();
		oops.extint = true;
		expect(fict.getValue(scientificName(human()))!.extint).toBe(false);
		fict.set(some(oops));
		expect(fict.getValue(scientificName(human()))!.extint).toBe(true);
	});

	test("setValue with real value", () => {
		fict.setValue(human());
		expect(fict.contains(human())).toBe(true);
	});

	test("setValue overwrites", () => {
		fict.setValue(human());
		const oops = human();
		oops.extint = true;
		expect(fict.getValue(scientificName(human()))!.extint).toBe(false);
		fict.setValue(oops);
		expect(fict.getValue(scientificName(human()))!.extint).toBe(true);
	});
});

describe("MappedSet with non-extinct species", () => {
	beforeEach(() => {
		fict = new MappedSet<Organism>(scientificName);
		fict.setValue(human());
		fict.setValue(dog());
	});

	test("remove", () => {
		fict.remove(human());
		expect(fict.contains(human())).toBe(false);
		expect(fict.contains(dog())).toBe(true);
		expect(fict.length).toBe(1);
	});

	test("removeAt", () => {
		fict.removeAt(scientificName(human()));
		expect(fict.contains(human())).toBe(false);
		expect(fict.contains(dog())).toBe(true);
		expect(fict.length).toBe(1);
	});

	test("clear", () => {
		fict.clear();
		expect(fict.contains(human())).toBe(false);
		expect(fict.contains(dog())).toBe(false);
		expect(fict.length).toBe(0);
	});

	test("copy", () => {
		const copy = fict.copy();
		expect(copy).not.toBe(fict);
		copy.setValue(direwolf());
		expect(copy.length).toBe(3);
		expect(fict.length).toBe(2);
	});
});
