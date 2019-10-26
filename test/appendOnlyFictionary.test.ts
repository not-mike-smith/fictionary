import "jest";
import { Organism, human, dog, direwolf, scientificName } from "./organism";
import { AppendOnlyFictionary } from "../src/index";

let fict: AppendOnlyFictionary<Organism>;

describe("empty AppendOnlyFictionary", () => {
	beforeEach(() => {
		fict = new AppendOnlyFictionary(scientificName);
	});

	test("tryAddValue", () => {
		fict.tryAddValue(human());
		expect(fict.values.length).toBe(1);
		expect(fict.getValue(scientificName(human()))).not.toBeUndefined();
		const oops = human();
		oops.extint = true;
		fict.tryAddValue(oops);
		expect(fict.values.length).toBe(1); // no addition
		expect(fict.getValue(scientificName(human()))!.extint).toBe(false); // no update
		fict.tryAddValue(dog());
		expect(fict.values.length).toBe(2);
	});

	test("length after adding", () => {
		expect(fict.length).toBe(0);
		fict.tryAddValue(human());
		expect(fict.length).toBe(1);
	});

	test("copy", () => {
		fict.tryAddValue(human());
		fict.tryAddValue(dog());
		const copy = fict.copy();
		expect(copy).not.toBe(fict);
		expect(copy.contains(human())).toBe(true);
		expect(copy.contains(dog())).toBe(true);
		copy.tryAddValue(direwolf());
		expect(copy.values.length).toBe(3);
		expect(fict.values.length).toBe(2);
	});

	test("asReadonly", () => {
		fict.tryAddValue(human());
		fict.tryAddValue(dog());
		const copy = fict.asReadonly();
		expect(copy).not.toBe(fict);
		expect(copy.contains(human())).toBe(true);
		expect(copy.contains(dog())).toBe(true);
		expect(() => (copy as AppendOnlyFictionary<Organism>).tryAddValue(direwolf())).toThrowError();
	});
});
