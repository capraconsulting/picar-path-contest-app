/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import PicarControlView from "../../views/PicarControlView";
import ControlPad from "../../components/ControlPad";

storiesOf("ControlPad", module).add("Splash", () =>
  <ControlPad handlePress={() => {}} />
);

storiesOf("PicarControlView", module).add("Splash", () =>
  <PicarControlView handlePress={() => {}} />
);
