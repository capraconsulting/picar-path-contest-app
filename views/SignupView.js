// @flow
import React from "react";
import { View, Text, TouchableNativeFeedback } from "react-native";

import { compose, withHandlers, setStatic } from "recompose";

import styled from "styled-components/native";

const StyledInput = styled.TextInput`
  width: 400px;
  height: 50px;
  font-size: 32px;
`;

const ContainerView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const SubmitButtonView = styled.View`
  background-color: darkseagreen;
  border-radius: 5px;
`;

const MarginText = styled.Text`
  margin: 10px;
  text-align: center;
  font-size: 32px;
`;

const enhancer = compose(
  setStatic("navigationOptions", {
    title: "Signup"
  }),
  withHandlers({
    navigateToControl: ({ navigation: { navigate } }) => () =>
      navigate("Controls")
  })
);

const SignupView = ({ navigateToControl }) =>
  <ContainerView>
    <StyledInput
      placeholder="Username"
      onSubmitEditing={navigateToControl}
      placeholderTkkk
    />
    <TouchableNativeFeedback onPress={navigateToControl}>
      <SubmitButtonView>
        <MarginText>Start</MarginText>
      </SubmitButtonView>
    </TouchableNativeFeedback>
  </ContainerView>;

export default enhancer(SignupView);
