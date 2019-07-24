import f from "../src/index";
import "jest";

test("emptyHackMap", () => {
	expect(f.emptyHackMap<string>()).not.toBeUndefined();
});
