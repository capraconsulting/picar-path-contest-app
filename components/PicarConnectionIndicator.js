// @flow
import React from "react";

import { View, Text, TouchableOpacity } from "react-native";
import { withHandlers } from "recompose";

import styled from "styled-components/native";

import PowerLight from "./PowerLight";

const ConnectionStatusText = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const FlexContainer = styled.View``;

const enhance = withHandlers({
  tryReconnect: ({ picarEnabled, tryReconnect }) => {
    if (picarEnabled) {
      return () => {};
    } else {
      return tryReconnect;
    }
  }
});

const PicarConnectionIndicator = ({
  picarEnabled = false,
  handlePress
}: {
  picarEnabled: boolean,
  handlePress: () => void
}) => (
  <FlexContainer>
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={picarEnabled ? 1 : 0.2}
    >
      <PowerLight enabled={picarEnabled} />
    </TouchableOpacity>
    <ConnectionStatusText>{`The picar is ${picarEnabled
      ? "online"
      : "offline"}`}</ConnectionStatusText>
  </FlexContainer>
);

export default enhance(PicarConnectionIndicator);
