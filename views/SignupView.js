// @flow
import React from "react";
import { View, Text, TouchableNativeFeedback, Keyboard } from "react-native";

import { graphql, gql } from "react-apollo";
import Spinner from "react-native-loading-spinner-overlay";

import { provideState, injectState, update, mergeIntoState } from "freactal";
import { compose, withHandlers, setStatic } from "recompose";

import styled from "styled-components/native";

import { formatResultTime } from "../utils";

const StyledInput = styled.TextInput`
  width: 400px;
  height: 50px;
  padding-bottom: 20px;
`;

const ContainerView = styled.View`
  flex: 1;
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
  font-size: 24px;
`;

const ErrorText = styled.Text`
  color: firebrick;
  font-size: 24px;
`;

const Title = styled.Text`
  font-size: 30px;
  padding-bottom: 20px;
  width: 600px;
`;

const Header = View;

const ResultTime = styled.Text`
  color: goldenrod;
  font-size: 30px;
  text-align: center;
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
        setErrorMessage("");
      } catch (err) {
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
      state: { errorMessage, username, phoneNo, time },
      effects: { setUsername, setPhoneNo }
    } = this.props;
    return (
      <ContainerView>
        <Header>
          <Text>Congratulations, you completed the course! Your time was</Text>
          <ResultTime>{formatResultTime(time)}</ResultTime>
          <Text>
            Enter a username and phone number to win your own Picar kit!
          </Text>
        </Header>
        <StyledInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          maxLength={25}
          blurOnSubmit={false}
          onSubmitEditing={this._handleUsernameSubmit}
        />
        <StyledInput
          innerRef={input => {
            this.phoneNoInput = input;
          }}
          maxLength={14}
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
            <MarginText>Submit</MarginText>
          </SubmitButtonView>
        </TouchableNativeFeedback>
      </ContainerView>
    );
  }
}

export default enhance(SignupView);
