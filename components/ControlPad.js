// @flow
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

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
  handlePress
}: {
  direction: Direction,
  handlePress: Direction => void
}) => (
  <TouchableOpacity onPress={() => handlePress(direction)}>
    <Icon name={getIconNameFromDirection(direction)} size={200} />
  </TouchableOpacity>
);

const RightLeftContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
`;

const ContainerView = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const Centered = styled.View`align-self: center;`;

const BigGreenText = styled.Text`
  font-size: 40px;
  color: green;
  line-height: 40px;
`;

const ThrottleButton = ({ handlePress }) => (
  <TouchableOpacity onPress={() => handlePress("DRIVE")}>
    <BigGreenText>DRIVE!</BigGreenText>
  </TouchableOpacity>
);

const ControlPad = ({ handlePress }: { handlePress: Direction => void }) => (
  <ContainerView>
    <Centered>
      <ArrowButton direction="FORWARD" handlePress={handlePress} />
    </Centered>
    <RightLeftContainer>
      <ArrowButton direction="LEFT" handlePress={handlePress} />
      <ThrottleButton handlePress={handlePress} />
      <ArrowButton direction="RIGHT" handlePress={handlePress} />
    </RightLeftContainer>
    <Centered>
      <ArrowButton direction="BACKWARD" handlePress={handlePress} />
    </Centered>
  </ContainerView>
);

export default ControlPad;
