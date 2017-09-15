// @flow
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

import { withHandlers } from "recompose";

import styled from "styled-components/native";

import Icon from "react-native-vector-icons/Entypo";

export type Direction = "FORWARD" | "BACKWARD" | "RIGHT" | "LEFT" | "DRIVE";

function getIconNameFromDirection(direction: Direction) {
  const name = {
    FORWARD: "up",
    BACKWARD: "down",
    RIGHT: "right",
    LEFT: "left",
    DRIVE: "up"
  }[direction];

  return `arrow-with-circle-${name}`;
}

export const ArrowButton = ({
  direction,
  disabled,
  handlePress
}: {
  direction: Direction,
  disabled: boolean,
  handlePress: Direction => void
}) => (
  <TouchableOpacity disabled={disabled} onPress={() => handlePress(direction)}>
    <Icon name={getIconNameFromDirection(direction)} size={100} />
  </TouchableOpacity>
);

const RightLeftContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 400px;
`;

const ContainerView = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
`;

const BigGreenText = styled.Text`
  font-size: 24px;
  color: green;
  line-height: 26px;
`;

const enhance = withHandlers({
  handlePress: ({ enabled, handlePress: ownerHandlePress }) => (
    direction: Direction
  ) => {
    if (enabled) {
      ownerHandlePress(direction);
    }
  }
});

const ControlPad = ({
  handlePress,
  enabled = false
}: {
  handlePress: Direction => void,
  enabled: boolean
}) => (
  <ContainerView>
    <Centered>
      <ArrowButton
        disabled={!enabled}
        direction="FORWARD"
        handlePress={handlePress}
      />
    </Centered>
    <RightLeftContainer>
      <ArrowButton
        disabled={!enabled}
        direction="LEFT"
        handlePress={handlePress}
      />
      <ArrowButton
        disabled={!enabled}
        direction="RIGHT"
        handlePress={handlePress}
      />
    </RightLeftContainer>
    <Centered>
      <ArrowButton
        disabled={!enabled}
        direction="BACKWARD"
        handlePress={handlePress}
      />
    </Centered>
  </ContainerView>
);

export default enhance(ControlPad);
