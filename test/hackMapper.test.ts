import * as f from "../src/index";
import "jest";
import { some, none } from "fp-ts/lib/Option";
import { Organism, human, dog, direwolf, scientificName } from "./organism";

let hackMapper: f.HackMapper<Organism>;
let hmap0: f.HackMap<Organism>;

describe("hack mapper with empty map", () => {
	beforeEach(() => {
		hackMapper = f.createHackMapper(scientificName);
		hmap0 = f.emptyHackMap<Organism>();
	});

	test("setValue", () => {
		const hmap1 = hackMapper.setValue(hmap0)(human());
		expect(hmap1).not.toBe(hmap0);
		expect(hmap1[scientificName(human())].genus).toBe("Homo");
		expect(hmap1[scientificName(human())].species).toBe("sapiens");
	});

	test("setValue overwrites", () => {
		const hmap1 = hackMapper.setValue(hmap0)(human());
		expect(hmap1[scientificName(human())].extint).toBe(false);
		const oops = human();
		oops.extint = true;
		const hmap2 = hackMapper.setValue(hmap1)(oops);
		expect(hmap2[scientificName(human())].extint).toBe(true);
	});

	test("set with some value", () => {
		const hmap1 = hackMapper.set(hmap0)(some(human()));
		expect(hmap1[scientificName(human())].genus).toBe("Homo");
		expect(hmap1[scientificName(human())].species).toBe("sapiens");
	});

	test("set with none value", () => {
		const hmap1 = hackMapper.set(hmap0)(none);
		expect(Object.keys(hmap1).length).toBe(0);
	});

	test("tryAddValue adds value for not present", () => {
		const hmap1 = hackMapper.tryAddValue(hmap0)(human());
		expect(hmap1).not.toBe(hmap0);
		expect(f.getValue(hmap1)(scientificName(human()))).not.toBeUndefined;
	});
});

describe("hack mapper with populated map", () => {
	beforeEach(() => {
		hackMapper = f.createHackMapper(scientificName);
		hmap0 = f.emptyHackMap<Organism>();
		hmap0 = hackMapper.setValue(hmap0)(human());
		hmap0 = hackMapper.setValue(hmap0)(dog());
	});

	test("contains", () => {
		const contains_ = hackMapper.contains(hmap0);
		expect(contains_(human())).toBe(true);
		expect(contains_(direwolf())).toBe(false);
	});

	test("tryAddValue returns same HackMap object if value already present", () => {
		const hmap1 = hackMapper.tryAddValue(hmap0)(human());
		expect(hmap1).toBe(hmap0);
	})

	test("remove", () => {
		const hmap1 = hackMapper.remove(hmap0)(human()); // N.B. removing a different instance!
		expect(hackMapper.contains(hmap1)(human())).toBe(false);
	});
});

describe("hack mapper just reuses the rest of the functions as is", () => {
	beforeEach(() => {
		hackMapper = f.createHackMapper(scientificName);
	});

	test("containsKey", () => { expect(hackMapper.containsKey).toBe(f.containsKey); });
	test("get", () => { expect(hackMapper.get).toBe(f.get); });
	test("getValue", () => { expect(hackMapper.getValue).toBe(f.getValue); });
	test("removeAt", () => { expect(hackMapper.removeAt).toBe(f.removeAt); });
	test("keys", () => { expect(hackMapper.keys).toBe(f.keys); });
	test("values", () => { expect(hackMapper.values).toBe(f.values); });
	test("pairs", () => { expect(hackMapper.pairs).toBe(f.pairs); });
})
