// @flow
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import RootView from "../../views/RootView";
import PicarControlView from "../../views/PicarControlView";

import ControlPad from "../../components/ControlPad";
import HighScoreList from "../../components/HighScoreList";
import Timer from "../../components/Timer";

storiesOf("ControlPad", module).add("Splash", () => (
  <ControlPad handlePress={() => {}} />
));

storiesOf("Timer", module).add("Basic", () => <Timer time={0} />);

storiesOf("PicarControlView", module).add("Splash", () => <PicarControlView />);

storiesOf("HighScoreList", module).add("Sample entries", () => {
  const data = [
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    },
    {
      score: 20,
      username: "sonic"
    },

    {
      score: 30,
      username: "mario"
    },
    {
      score: 60,
      username: "pacman"
    }
  ];

  return <HighScoreList highScores={data} currentUser="pacman" />;
});

storiesOf("RootView", module).add("Full app", () => <RootView />);
