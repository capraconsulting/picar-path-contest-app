// @flow
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react";

import faker from "faker";
import R from "ramda";

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

storiesOf("PicarControlView", module).add("Normal", () => <PicarControlView />);

const generateMockHighScoreEntries = n =>
  R.map(
    n => ({
      score: (n + 1) * 10,
      username: faker.internet.userName()
    }),
    R.range(0, n)
  );

storiesOf("HighScoreList", module).add("Part of top five", () => {
  const data = generateMockHighScoreEntries(5);

  return <HighScoreList highScores={data} currentUser={data[2]} />;
});

storiesOf("HighScoreList", module).add('Sixth place ("corner case")', () => {
  const data = generateMockHighScoreEntries(6);

  return <HighScoreList highScores={data} currentUser={data[5]} />;
});

storiesOf("HighScoreList", module).add("Outside top six", () => {
  const data = generateMockHighScoreEntries(20);

  return <HighScoreList highScores={data} currentUser={data[12]} />;
});

storiesOf("RootView", module).add("Full app", () => <RootView />);
