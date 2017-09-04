// @flow
import React from "react";

import { gql, graphql } from "react-apollo";

import { Alert, View, Text, TouchableNativeFeedback } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import {
  compose,
  setStatic,
  withReducer,
  withHandlers,
  lifecycle,
  pure
} from "recompose";
import { provideState, injectState, update } from "freactal";

import { QueueingSubject } from "queueing-subject";
import websocketConnect from "rxjs-websockets";

import styled from "styled-components/native";

import { PICAR_WEBSOCKET_ADDRESS } from "../config";

import ControlPad, { type Direction } from "../components/ControlPad";
import Timer from "../components/Timer";

const token = "verysecrettoken";

const ContainerView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

type ControlViewState = {
  directions: Array<Direction>,
  picarEnabled: boolean,
  time: number
};

// Presentational components
const Title = styled.Text`
  text-align: center;
  font-size: 30px;
  margin-left: 30px;
  margin-right: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  color: firebrick;
`;

const FinishButtonView = styled.View`
  background-color: darkseagreen;
  border-radius: 5px;
  margin-bottom: 40px;
`;

const MarginText = styled.Text`
  margin: 10px;
  text-align: center;
  font-size: 24px;
`;

// Move some of this stuff, getting big this file
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
  graphql(HighScoreListNewEntryMutation),
  setStatic("navigationOptions", {
    title: "Controls"
  }),
  injectState,
  lifecycle({
    componentWillMount() {
      // Setup Websocket subscription and upsream subject
      const inputSubject = new QueueingSubject();
      const { messages, connectionStatus } = websocketConnect(
        PICAR_WEBSOCKET_ADDRESS,
        inputSubject
      );
      const messageSubscription = messages.subscribe(message => {
        if (message.error) {
          return console.error(message.error);
        }
        /* this.state.stopTimer();*/
      });

      // Setup timer
      const timer = setInterval(this.props.effects.incrementTime, 100);

      this.setState({
        messageSubscription,
        inputSubject,
        stopTimer: () => clearInterval(timer)
      });
    },
    componentWillUnmount() {
      this.state.stopTimer();

      this.state.messageSubscription.unsubscribe();
    }
  }),
  withHandlers({
    submitDirection: props => (direction: Direction) =>
      props.inputSubject.next({ action: direction }),

    finishContest: ({
      navigation: { navigate },
      mutate,
      stopTimer,
      state: { time: score }
    }) => () => {
      stopTimer();
      navigate("Signup");
    }
  })
);

const FinishContestButton = styled.Text`
  color: green;
  font-size: 24px;
`;

const PicarControlView = ({
  dispatch,
  submitDirection,
  finishContest,
  state: { directions, time }
}: {
  dispatch: () => void,
  submitDirection: Direction => void,
  finishContest: () => void,
  state: ControlViewState
}) => (
  <ContainerView>
    <Title>
      Use the arrow buttons to control the car and bring it safely through the
      course!
    </Title>
    <ControlPad handlePress={submitDirection} />
    <Timer time={time} />
    <TouchableNativeFeedback onPress={finishContest}>
      <FinishButtonView>
        <MarginText>Finish contest</MarginText>
      </FinishButtonView>
    </TouchableNativeFeedback>
  </ContainerView>
);

export default enhance(PicarControlView);
