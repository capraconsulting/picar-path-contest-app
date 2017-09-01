// @flow
import React from "react";
import { View, Text, TouchableNativeFeedback, Keyboard } from "react-native";

import { graphql, gql } from "react-apollo";

import { provideState, injectState, update, mergeIntoState } from "freactal";
import { compose, withHandlers, setStatic } from "recompose";

import styled from "styled-components/native";

const StyledInput = styled.TextInput`
  width: 400px;
  height: 50px;
  font-size: 24px;
  padding-bottom: 20px;
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

const ErrorText = styled.Text`
  color: firebrick;
  font-size: 24px;
`;

const HighScoreListNewEntryMutation = gql`
  mutation CreateHighScoreEntry(
    $score: Int!
    $username: String!
    $phoneNo: String!
  ) {
    createHighScoreEntry(
      score: $score
      username: $username
      phoneNo: $phoneNo
    ) {
      id
    }
  }
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Signup"
  }),
  graphql(HighScoreListNewEntryMutation),
  provideState({
    effects: {
      setErrorMessage: update((state, errorMessage) => ({ errorMessage }))
    }
  }),
  injectState,
  withHandlers({
    handleSubmit: ({
      navigation: { navigate },
      state: { username, phoneNo, time: score },
      effects: { setErrorMessage },
      mutate
    }) => async () => {
      try {
        await mutate({
          variables: {
            score,
            username,
            phoneNo
          }
        });
      } catch (err) {
        console.error(err);
        setErrorMessage(
          "The username or phone number has already been registered! \n Enter a different username and/or phone number"
        );
        return;
      }
      Keyboard.dismiss();
      navigate("HighScoreList");
    }
  })
);

class SignupView extends React.Component {
  phoneNoInput: ?HTMLInputElement;

  _handleUsernameSubmit = () => {
    if (this.phoneNoInput != null) {
      this.phoneNoInput.focus();
    }
  };

  render() {
    const {
      handleSubmit,
      state: { errorMessage, username, phoneNo },
      effects: { setUsername, setPhoneNo }
    } = this.props;
    return (
      <ContainerView>
        <StyledInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          blurOnSubmit={false}
          onSubmitEditing={this._handleUsernameSubmit}
        />
        <StyledInput
          innerRef={input => {
            this.phoneNoInput = input;
          }}
          value={phoneNo}
          placeholder="Phone number"
          onChangeText={setPhoneNo}
          keyboardType="numeric"
          onSubmitEditing={handleSubmit}
          placeholderText="Phonenumber"
        />

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <TouchableNativeFeedback onPress={handleSubmit}>
          <SubmitButtonView>
            <MarginText>Start</MarginText>
          </SubmitButtonView>
        </TouchableNativeFeedback>
      </ContainerView>
    );
  }
}

export default enhance(SignupView);
