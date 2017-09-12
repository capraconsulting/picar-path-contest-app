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

const FlexContainer = styled.View`width: 1000px;`;

const enhance = withHandlers({
  handlePress: ({ picarEnabled, tryReconnect }) => {
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
      : "offline. Touch the red circle to try to reconnect"}`}</ConnectionStatusText>
  </FlexContainer>
);

export default enhance(PicarConnectionIndicator);
