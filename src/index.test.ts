import f from "../src/index";
import "jest";

test("emptyHackMap", () => {
	expect(f.emptyHackMap<string>()).not.toBeUndefined();
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
