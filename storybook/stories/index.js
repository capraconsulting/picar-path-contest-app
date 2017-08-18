/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import PicarControlView from "../../views/PicarControlView";
import ControlPad from "../../components/ControlPad";
import Timer from "../../components/Timer";

storiesOf("ControlPad", module).add("Splash", () =>
  <ControlPad handlePress={() => {}} />
);

storiesOf("Timer", module).add("Basic", () => <Timer time={0} />);

storiesOf("PicarControlView", module).add("Splash", () => <PicarControlView />);
