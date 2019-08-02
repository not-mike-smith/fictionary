import f from "../src/index";
import "jest";
import { some, none, isSome, fold, Option } from "fp-ts/lib/Option";
import { identity } from "fp-ts/lib/function";

test("emptyHackMap", () => {
	const x = f.emptyHackMap<string>();
	expect(x).not.toBeUndefined();
	expect(Object.keys(x).length).toBe(0);
});

test("setValue single string entry", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	expect(x).not.toBe(y);
	expect(y["key"]).toBe("value");
});

test("setValue single string entry overwritten", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	const z = f.setValue(y)("key")("value2");
	expect(x).not.toBe(y);
	expect(y).not.toBe(z);
	expect(z["key"]).toBe("value2");
	expect(Object.keys(z).length).toBe(1);
});

test("setValue does not mutate HackMap", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	expect(x["key"]).toBeUndefined();
});

test("setValue with undefined deletes entry", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	const z = f.setValue(y)("key")(undefined);
	expect(Object.keys(z).length).toBe(0);
	const y2 = f.setValue(x)("key")(undefined);
	expect(Object.keys(y2).length).toBe(0);
})

test("getValue", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	expect(f.getValue(y)("key")).toBe("value");
	expect(f.getValue(x)("key")).toBeUndefined();
});

test("containsKey", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	expect(f.containsKey(x)("key")).toBe(false);
	expect(f.containsKey(y)("key")).toBe(true);
});

test("getOrThrow", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	expect(f.getOrThrow(y)("key")).toBe("value");
	expect(() => f.getOrThrow(x)("key")).toThrowError("no non-null value exists for key, 'key'");
});

test("tryAddValue", () => {
	const x = f.emptyHackMap<string>();
	const y = f.tryAddValue(x)("key")("value");
	expect(y["key"]).toBe("value");
	const z = f.tryAddValue(y)("key")("value2");
	expect(y).toBe(z); // same instance!
	expect(z["key"]).toBe("value") // not "value2"
})

test("set with some value", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(some("value"));
	expect(y["key"]).toBe("value");
});

test("set with none value", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(none);
	expect(Object.keys(y).length).toBe(0);
	const y2 = f.set(x)("key")(some("value"));
	const z = f.set(y2)("key")(none);
	expect(Object.keys(z).length).toBe(0);
});

test("set does not mutate HackMap", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(some("value"));
	expect(Object.keys(x).length).toBe(0);
});

test("set overwrite single value", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(some("value"));
	const z = f.set(y)("key")(some("value2"));
	expect(z["key"]).toBe("value2");
	expect(Object.keys(z).length).toBe(1);
});

const foldErrorOrIdentity: (option: Option<string> ) => string = fold(() => "error", identity);

test("get existing value", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(some("value"));
	const valueOption = f.get(y)("key");
	expect(valueOption._tag).toBe("Some");
	expect(foldErrorOrIdentity(valueOption)).toBe("value")
})
