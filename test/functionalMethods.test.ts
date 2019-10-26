import * as f from "../src/index";
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

test("can set value to key other than \"key\"", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("foo")("bar");
	expect(f.getValue(y)("foo")).toBe("bar");
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
});

test("removeAt removes only what it's supposed to", () => {
	const x = f.emptyHackMap<string>();
	const y = f.set(x)("key")(some("value"));
	const z = f.set(y)("key2")(some("value2"));
	const a = f.removeAt(z)("key");
	expect(f.get(a)("key")._tag).toBe("None");
	expect(f.getValue(a)("key2")).toBe("value2");
});

test("tryAddValue adds value for key not present", () => {
	const x = f.emptyHackMap<string>();
	const y = f.tryAddValue(x)("key")("value");
	expect(x).not.toBe(y);
	expect(f.getValue(y)("key")).toBe("value");
});

test("tryAddValue returns same HackMap object if key is already present", () => {
	const x = f.emptyHackMap<string>();
	const y = f.setValue(x)("key")("value");
	const z = f.tryAddValue(y)("key")("new value");
	expect(z).toBe(y);
	expect(f.getValue(z)("key")).toBe("value");
});

test("keys returns all keys", () => {
	const x = f.emptyHackMap<string>();
	expect(f.keys(x).length).toBe(0);
	const y = f.setValue(x)("key")("value");
	expect(f.keys(y).length).toBe(1);
	expect(f.keys(y)[0]).toBe("key");
	const z = f.setValue(y)("key2")("value2");
	const zKeys = f.keys(z);
	expect(zKeys.length).toBe(2);
	expect(zKeys.indexOf("key")).toBeGreaterThanOrEqual(0);
	expect(zKeys.indexOf("key2")).toBeGreaterThanOrEqual(0);
});

test("values returns all values", () => {
	const x = f.emptyHackMap<string>();
	expect(f.values(x).length).toBe(0);
	const y = f.setValue(x)("key")("value");
	expect(f.values(y).length).toBe(1);
	expect(f.values(y)[0]).toBe("value");
	const z = f.setValue(y)("key2")("value2");
	const zValues = f.values(z);
	expect(zValues.length).toBe(2);
	expect(zValues.indexOf("value")).toBeGreaterThanOrEqual(0);
	expect(zValues.indexOf("value2")).toBeGreaterThanOrEqual(0);
});

test("pairs returns all pairs", () => {
	const x = f.emptyHackMap<string>();
	expect(f.pairs(x).length).toBe(0);
	const y = f.setValue(x)("key")("value");
	expect(f.pairs(y).length).toBe(1);
	expect(f.pairs(y)[0].key).toBe("key");
	expect(f.pairs(y)[0].value).toBe("value");
	const z = f.setValue(y)("key2")("value2");
	const zPairs = f.pairs(z);
	expect(zPairs.length).toBe(2);
	expect(zPairs.findIndex(p => p.key === "key")).toBeGreaterThanOrEqual(0);
	expect(zPairs.findIndex(p => p.key === "key2")).toBeGreaterThanOrEqual(0);
	expect(zPairs.findIndex(p => p.value === "value")).toBeGreaterThanOrEqual(0);
	expect(zPairs.findIndex(p => p.value === "value2")).toBeGreaterThanOrEqual(0);
});
