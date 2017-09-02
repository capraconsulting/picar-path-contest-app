// @flow
import React from "react";

import { TouchableNativeFeedback } from "react-native";

import { compose, withHandlers, setStatic, pure } from "recompose";

import styled from "styled-components/native";

const StyledInput = styled.TextInput`
  width: 400px;
  height: 50px;
  font-size: 24px;
`;

const ContainerView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const StartButtonView = styled.View`
  background-color: darkseagreen;
  border-radius: 5px;
`;

const MarginText = styled.Text`
  margin: 10px;
  text-align: center;
  font-size: 32px;
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Welcome!"
  }),
  withHandlers({
    handlePress: ({ navigation: { navigate } }) => () => {
      navigate("Controls");
    }
  }),
  pure
);

const GreetingView = ({ handlePress }) => (
  <ContainerView>
    <TouchableNativeFeedback onPress={handlePress}>
      <StartButtonView>
        <MarginText>Start your race!</MarginText>
      </StartButtonView>
    </TouchableNativeFeedback>
  </ContainerView>
);

export default enhance(GreetingView);
