export type Organism = {
	genus: string;
	species: string;
	extint: boolean;
}

export const human: () => Organism = () => ({
	genus: "Homo",
	species: "sapiens",
	extint: false
});

export const dog: () => Organism = () => ({
	genus: "Canis",
	species: "lupus familiarus",
	extint: false
});

export const direwolf: () => Organism = () => ({
	genus: "Canis",
	species: "dirus",
	extint: true
});

export const scientificName = (o: Organism) => `${o.genus} ${o.species}`;