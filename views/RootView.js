import React from "react";

import { StackNavigator } from "react-navigation";

import styled from "styled-components/native";

import SignupView from "./views/SignupView";
import PicarControlView from "./views/PicarControlView";

const RootView = StackNavigator({
  Signup: {
    screen: SignupView
  },
  Controls: {
    screen: PicarControlView
  }
});


export default RootView;
