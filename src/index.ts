import { Option, fromNullable, isNone, exists, isSome } from "fp-ts/lib/Option";

namespace Moctionary {
	export interface HackMap<TValue> {
		readonly [index: string]: TValue;
	}

	export const emptyHackMap = <TValue>(): HackMap<TValue>  => Object.freeze({});

	export const containsKey = <TValue>(hackMap: HackMap<TValue>) => (key: string) => hackMap[key] !== undefined;

	export const getValue = <TValue>(hackMap: HackMap<TValue>) => (key: string): TValue | undefined => hackMap[key];

	export const get = <TValue>(hackMap: HackMap<TValue>) => (key: string): Option<TValue> => fromNullable(hackMap[key]);

	export const removeAt = <TValue>(hackMap: HackMap<TValue>) => (key: string): HackMap<TValue> => {
		const ret = {...hackMap};
		delete ret[key];
		return ret;
	}

	export const set = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: Option<TValue>): HackMap<TValue> => {
		if (isNone(value)) return removeAt(hackMap)(key);

		return {
			...hackMap,
			key: value.value
		};
	}

	export const setValue = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: TValue | undefined): HackMap<TValue> => {
		return set(hackMap)(key)(fromNullable(value));
	}

	export const tryAddValue = <TValue>(hackMap: HackMap<TValue>) => (key: string) => (value: TValue): HackMap<TValue> => {
		if (containsKey(hackMap)) return hackMap;

		return setValue(hackMap)(key)(value);
	}

	export interface HackMapper<TValue> {
		readonly containsKey: (hackMap: HackMap<TValue>) => (key: string) => boolean;
		readonly get: (hackMap: HackMap<TValue>) => (key: string) => Option<TValue>;
		readonly set: (hackMap: HackMap<TValue>) => (t: Option<TValue>) => HackMap<TValue>;
		readonly getValue: (hackMap: HackMap<TValue>) => (key: string) => TValue | undefined;
		readonly setValue: (hackMap: HackMap<TValue>) => (t: TValue) => HackMap<TValue>;
		readonly removeAt: (hackMap: HackMap<TValue>) => (key: string) => HackMap<TValue>;
		readonly remove: (hackMap: HackMap<TValue>) => (value: TValue) => HackMap<TValue>;
		readonly tryAddValue: (hackMap: HackMap<TValue>) => (value: TValue) => HackMap<TValue>;
	}

	export const createHackMapper = <TValue>(getKey: (value: TValue) => string): HackMapper<TValue> => Object.freeze({
		containsKey,
		get,
		getValue,
		removeAt,
		set: (hackMap: HackMap<TValue>) => (value: Option<TValue>) => isNone(value) ? hackMap : set(hackMap)(getKey(value.value))(value),
		setValue: (hackMap: HackMap<TValue>) => (value: TValue) => setValue(hackMap)(getKey(value))(value),
		remove: (hackMap: HackMap<TValue>) => (value: TValue) => removeAt(hackMap)(getKey(value)),
		tryAddValue: (hackMap: HackMap<TValue>) => (value: TValue) => tryAddValue(hackMap)(getKey(value))(value),
	});

	export class Moctionary<T> {
		private _hackMap: HackMap<T> = emptyHackMap();
		private readonly _hackMapper: HackMapper<T>;

		constructor(getKey: (value: T) => string) {
			this._hackMapper = createHackMapper(getKey);
			this.containsKey = this.containsKey.bind(this);
			this.get = this.get.bind(this);
			this.set = this.set.bind(this);
			this.getValue = this.getValue.bind(this);
			this.setValue = this.setValue.bind(this);
			this.removeAt = this.removeAt.bind(this);
			this.remove = this.remove.bind(this);
			this.tryAddValue  = this.tryAddValue.bind(this);
		}

		public containsKey(key: string) {
			return this._hackMapper.containsKey(this._hackMap)(key);
		}

		public get(key: string) {
			return this._hackMapper.get(this._hackMap)(key);
		}

		public set(value: Option<T>) {
			this._hackMap = this._hackMapper.set(this._hackMap)(value);
		}

		public getValue(key: string) {
			return this._hackMapper.getValue(this._hackMap)(key);
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

		public tryAddValue(value: T) {
			this._hackMap = this._hackMapper.tryAddValue(this._hackMap)(value);
		}
	}
}

export default Moctionary;
