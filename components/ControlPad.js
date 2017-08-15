// @flow
import React from "react";
import { TouchableOpacity, View } from "react-native";

import styled from "styled-components/native";

import Icon from "react-native-vector-icons/Entypo";

export type Direction = "up" | "down" | "right" | "left";

export const ArrowButton = ({
  direction,
  handlePress
}: {
  direction: Direction,
  handlePress: Direction => void
}) =>
  <TouchableOpacity onPress={() => handlePress(direction)}>
    <Icon name={`arrow-with-circle-${direction}`} size={200} />
  </TouchableOpacity>;

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

const ControlPad = ({ handlePress }: { handlePress: Direction => void }) =>
  <ContainerView>
    <Centered>
      <ArrowButton direction="up" handlePress={handlePress} />
    </Centered>
    <RightLeftContainer>
      <ArrowButton direction="left" handlePress={handlePress} />
      <ArrowButton direction="right" handlePress={handlePress} />
    </RightLeftContainer>
    <Centered>
      <ArrowButton direction="down" handlePress={handlePress} />
    </Centered>
  </ContainerView>;
export default ControlPad;
