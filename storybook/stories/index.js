/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import PicarControlView from "../../views/PicarControlView";

storiesOf("PicarControlView", module)
  .add("splash screen", () => <PicarControlView />)
  .add("sample directions", () =>
    <PicarControlView initialDirections={["up", "down", "right", "left"]} />
  );
