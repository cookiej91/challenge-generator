import React, { Component } from "react";
import Button from "./Button";
import Items from "./Items";
import Rule from "./Rule";
import adjectives from "../json/adjectives.json";
import characters from "../json/characters.json";
import colours from "../json/colours.json";
import getCurrentSeed from "../lib/getCurrentSeed";
import getRandomWithSeed from "../lib/getRandomWithSeed";
import generateRandomSeed from "../lib/generateRandomSeed";
import items from "../json/items.json";
import rooms from "../json/rooms.json";

export default class ChallengeGenerator extends Component {
  constructor() {
    super();

    this.state = {
      seed: getCurrentSeed()
    };
  }

  handleGenerate() {
    window.location = `?seed=${generateRandomSeed()}`;
  }

  render() {
    const { seed } = this.state;

    const [playableCharacter] = getRandomWithSeed(characters, seed);
    const [endingRoom] = getRandomWithSeed(rooms, seed);
    const [colour] = getRandomWithSeed(colours, seed);
    const [adjective] = getRandomWithSeed(adjectives, seed);
    const startingItems = getRandomWithSeed(items, seed, 3);

    return (
      <>
        <div className="page-title">
          <h1>BoI: Challenge Generator</h1>
        </div>
        <div className="challenge-title">
          <span id="title-adjective">{adjective}</span>{" "}
          <span id="title-colour" style={{ color: colour.hex }}>
            {colour.name}
          </span>{" "}
          <span id="title-character">{playableCharacter}</span>
        </div>
        <div className="container">
          <Rule type="Challenge #">{seed}</Rule>
          <Rule type="Character">{playableCharacter}</Rule>
          <Rule type="Starting Items">
            <Items items={startingItems} />
          </Rule>
          <Rule type="Room">{endingRoom}</Rule>
        </div>
        <div className="buttons">
          <Button onClick={this.handleGenerate}>Generate Seed</Button>
          <Button>Share</Button>
          <Button>Help</Button>
        </div>
      </>
    );
  }
}
