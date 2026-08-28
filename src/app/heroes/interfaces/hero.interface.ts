export interface Hero {
    id:          number;
    name:        string;
    slug?:        string;
    powerstats:  Powerstats;
    appearance:  Appearance;
    biography:   Biography;
    work?:        Work;
    images:      Images;
}

export interface Powerstats {
    intelligence: number;
    strength:     number;
    speed:        number;
    durability:   number;
    power:        number;
    combat:       number;
}
export interface Appearance {
    gender:    Gender;
    race?:      null | string;
    height?:    string[];
    weight?:    string[];
    eyeColor?:  string;
    hairColor?: string;
}

export enum Gender {
    Empty = "-",
    Female = "Female",
    Male = "Male",
}

export interface Biography {
    fullName:        string;
    alterEgos?:       string;
    aliases?:         string[];
    placeOfBirth:    string;
    publisher:       null | string;
    alignment?:       Alignment;
}

export enum Alignment {
    Bad = "bad",
    Empty = "-",
    Good = "good",
    Neutral = "neutral",
}


export interface Images {
    xs?: string;
    sm?: string;
    md: string;
    lg?: string;
}


export interface Work {
    occupation: string;
    base:       string;
}
