// @flow
import React from "react";

import { gql, graphql } from "react-apollo";

import { Alert, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import ControlPad, { type Direction } from "../components/ControlPad";
import Timer from "../components/Timer";

import {
  compose,
  setStatic,
  withReducer,
  withHandlers,
  lifecycle
} from "recompose";
import { provideState, injectState, update } from "freactal";

import { QueueingSubject } from "queueing-subject";
import websocketConnect from "rxjs-websockets";

import styled from "styled-components/native";

const token = "verysecrettoken";

/* const PICAR_WEBSOCKET_ADDRESS = `ws://192.168.1.176:5000/picar_action?token=${token}`;*/
const PICAR_WEBSOCKET_ADDRESS = "wss://echo.websocket.org";

const ContainerView = styled.View`
  flex: 1;
  justify-content: center;
`;

type ControlViewState = {
  directions: Array<Direction>,
  picarEnabled: boolean,
  time: number
};

// Presentational components
const Title = styled.Text`
  font-size: 48px;
  color: firebrick;
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
    <Timer time={time} />
    <ControlPad handlePress={submitDirection} />
    <TouchableOpacity onPress={finishContest}>
      <FinishContestButton>Finish contest</FinishContestButton>
    </TouchableOpacity>
  </ContainerView>
);

export default enhance(PicarControlView);
