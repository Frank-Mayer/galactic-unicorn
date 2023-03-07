import { useEffect, useState } from "react";

const separator = "-";
const word1 = [
    "super" + separator + "duper",
    "bug" + separator + "free",
    "awesome",
    "animated",
    "friendly",
    "curly",
    "stunning",
    "fancy",
    "reimagined",
    "turbo",
    "symmetrical",
    "fuzzy",
    "special",
    "super",
    "stunning",
    "laughing",
    "legendary",
    "psychic",
    "miniature",
];
const word2 = [
    "umbrella",
    "carnival",
    "googles",
    "disco",
    "adventure",
    "party",
    "waddle",
    "wuzzy",
    "happyness",
    "fun",
    "waffle",
    "spoon",
    "meme",
    "giggle",
    "broccoli",
];

export const getRandomProjectName = () => {
    const i = Math.floor(Math.random() * word1.length);
    const j = Math.floor(Math.random() * word2.length);
    const uni = Math.random() < 0.2;

    if (uni) {
        return word1[i] + separator + "unicorn" + separator + word2[j];
    }

    return word1[i] + separator + word2[j];
};
