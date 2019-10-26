import { Option, fromNullable, isNone, exists, isSome, fold, getOrElse } from "fp-ts/lib/Option";

namespace Fictionary {
	export interface HackMap<TValue> {
		readonly [index: string]: TValue;
	}

	/**
	 * create a new, empty `HackMap` object to store objects of type `TValue`
	 */
	export const emptyHackMap = <TValue>(): HackMap<TValue>  => Object.freeze({});

	/**
	 * return __true__ if _hackMap_ contains _key_, else __false__
	 */
	export const containsKey = <TValue>(hackMap: HackMap<TValue>) => (key: string) => hackMap[key] !== undefined;

	const unsafeGetValue = <TValue>(hackMap: HackMap<TValue>) => (key: string): TValue => hackMap[key];

	/**
	 * retreive `Option` of value (__none__ if no value exists) for _key_
	 */
	export const get = <TValue>(hackMap: HackMap<TValue>) => (key: string): Option<TValue> => fromNullable(hackMap[key]);

	/**
	 * get value for _key_ or throw __ReferenceError__ if _hackMap_ does not contain _key_
	 */
	export const getOrThrow = <TValue>(hackMap: HackMap<TValue>) => (key: string): TValue => {
		const opt = get(hackMap)(key);
		if (isNone(opt)) throw ReferenceError(`no non-null value exists for key, '${key}'`);

		return opt.value;
	}

	/**
	 * Construct new `HackMap` object, removing  _key_
	 */
	export const removeAt = <TValue>(hackMap: HackMap<TValue>) => (key: string): HackMap<TValue> => {
		const ret = {...hackMap};
		delete ret[key];
		return ret;
	}

	/**
	 * Constrcut new `HackMap` object, adding _key_ and _value_ if not already present, overwriting _value_ it is not __none__, else removing the _key_
	 */
	export const set = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: Option<TValue>): HackMap<TValue> => {
		if (isNone(value)) return removeAt(hackMap)(key);

		const ret = {...hackMap};
		ret[key] = value.value;
		return ret;
	}

	/**
	 * Construct new `HackMap` object, adding _key_ and _value_ if not already present, overwriting _value_ if it is neither null nor undefined, else removing the _key_
	 */
	export const setValue = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: TValue | undefined): HackMap<TValue> => {
		return set(hackMap)(key)(fromNullable(value));
	}

	/**
	 * return same `HackMap` object if _key_ is already present in _hackMap_, else construct new `HackMap` object with _key-value_ pair added
	 */
	export const tryAddValue = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: TValue): HackMap<TValue> => {
		if (containsKey(hackMap)(key)) return hackMap;

		return setValue(hackMap)(key)(value);
	}
	/**
	 * get array of all keys in _hackMap_
	 */
	export const keys = <TValue>(hackMap: HackMap<TValue>): string[] => Object.keys(hackMap);

	/**
	 * get array of all `TValue` objects in _hackMap_
	 */
	export const values = <TValue>(hackMap: HackMap<TValue>): TValue[] => keys(hackMap).map(unsafeGetValue(hackMap));

	/**
	 * get array of key-value pairs in _hackMap_
	 * @returns array of `{ key: string, value: TValue }` objects
	 */
	export const pairs = <TValue>(hackMap: HackMap<TValue>): {key: string, value: TValue}[] => {
		const unsafeGetValue_ = unsafeGetValue(hackMap);
		const f = (key: string) => ({ key, value: unsafeGetValue_(key) });

		return keys(hackMap).map(f);
	}

	/**
	 * get value associated with _key_ in _hackMap_ if it exists, else `undefined`
	 */
	export const getValue = <TValue>(hackMap: HackMap<TValue>) => (key: string): TValue | undefined => hackMap[key] as TValue;

	export interface HackMapper<TValue> {
		readonly containsKey: (hackMap: HackMap<TValue>) => (key: string) => boolean;
		readonly get: (hackMap: HackMap<TValue>) => (key: string) => Option<TValue>;
		readonly set: (hackMap: HackMap<TValue>) => (t: Option<TValue>) => HackMap<TValue>;
		readonly getValue: (hackMap: HackMap<TValue>) => (key: string) => TValue | undefined;
		readonly setValue: (hackMap: HackMap<TValue>) => (t: TValue) => HackMap<TValue>;
		readonly removeAt: (hackMap: HackMap<TValue>) => (key: string) => HackMap<TValue>;
		readonly remove: (hackMap: HackMap<TValue>) => (value: TValue) => HackMap<TValue>;
		readonly tryAddValue: (hackMap: HackMap<TValue>) => (value: TValue) => HackMap<TValue>;
		readonly keys: (hackMap: HackMap<TValue>) => string[];
		readonly values: (hackMap: HackMap<TValue>) => TValue[];
		readonly pairs: (hackMap: HackMap<TValue>) => { key: string, value: TValue }[];
	}

	export const createHackMapper = <TValue>(getKey: (value: TValue) => string): HackMapper<TValue> => Object.freeze({
		containsKey,
		get,
		getValue,
		removeAt,
		keys,
		values,
		pairs,
		set: (hackMap: HackMap<TValue>) => (value: Option<TValue>) => isNone(value) ? hackMap : set(hackMap)(getKey(value.value))(value),
		setValue: (hackMap: HackMap<TValue>) => (value: TValue) => setValue(hackMap)(getKey(value))(value),
		remove: (hackMap: HackMap<TValue>) => (value: TValue) => removeAt(hackMap)(getKey(value)),
		tryAddValue: (hackMap: HackMap<TValue>) => (value: TValue) => tryAddValue(hackMap)(getKey(value))(value),
	});

	export class ReadonlyFictionary<T> {
		protected readonly _getKey: (t: T) => string;
		protected _hackMap: HackMap<T>;
		protected readonly _hackMapper: HackMapper<T>;

		constructor(getKey: (value: T) => string, hackMap: HackMap<T> = emptyHackMap<T>()) {
			this._getKey = getKey;
			this._hackMap = hackMap;
			this._hackMapper = createHackMapper(getKey);

			this.containsKey = this.containsKey.bind(this);
			this.get = this.get.bind(this);
			this.getValue = this.getValue.bind(this);
			this.keys = this.keys.bind(this);
			this.values = this.values.bind(this);
			this.pairs = this.pairs.bind(this);
			this.copy = this.copy.bind(this);
		}

		public get currentHackMap() {
			return this._hackMap;
		}

		public containsKey(key: string) {
			return this._hackMapper.containsKey(this._hackMap)(key);
		}

		public get(key: string) {
			return this._hackMapper.get(this._hackMap)(key);
		}

		public getValue(key: string) {
			return this._hackMapper.getValue(this._hackMap)(key);
		}

		public keys() {
			return this._hackMapper.keys(this._hackMap);
		}

		public values() {
			return this._hackMapper.values(this._hackMap);
		}

		public pairs() {
			return this._hackMapper.pairs(this._hackMap);
		}

		public copy() {
			return new ReadonlyFictionary(this._getKey, this.currentHackMap);
	}
}

	export class AppendOnlyFictionary<T> extends ReadonlyFictionary<T> {
		constructor(getKey: (value: T) => string, hackMap: HackMap<T> = emptyHackMap<T>()) {
			super(getKey, hackMap);

			this.tryAddValue  = this.tryAddValue.bind(this);
			this.copy = this.copy.bind(this);
		}

		public tryAddValue(value: T) {
			this._hackMap = this._hackMapper.tryAddValue(this._hackMap)(value);
		}

		public copy() {
			return new AppendOnlyFictionary(this._getKey, this.currentHackMap);
		}
	}

	export class Fictionary<T> extends AppendOnlyFictionary<T> {
		constructor(getKey: (value: T) => string, hackMap: HackMap<T> = emptyHackMap<T>()) {
			super(getKey, hackMap)
			this.set = this.set.bind(this);
			this.setValue = this.setValue.bind(this);
			this.removeAt = this.removeAt.bind(this);
			this.remove = this.remove.bind(this);
			this.clear = this.clear.bind(this);
			this.copy = this.copy.bind(this);
		}

		public set(value: Option<T>) {
			this._hackMap = this._hackMapper.set(this._hackMap)(value);
		}

		public setValue(value: T) {
			this._hackMap = this._hackMapper.setValue(this._hackMap)(value);
		}

		public removeAt(key: string) {
			this._hackMap = this._hackMapper.removeAt(this._hackMap)(key);
		}

		public remove(value: T) {
			this._hackMap = this._hackMapper.remove(this._hackMap)(value);
		}

		public clear() {
			this._hackMap = emptyHackMap();
		}

		public copy() {
			return new Fictionary(this._getKey, this.currentHackMap);
		}

		public asReadonly() {
			return new ReadonlyFictionary(this._getKey, this.currentHackMap);
		}
	}
}

export default Fictionary;
