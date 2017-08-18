// @flow
import React from "react";
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

const PICAR_WEBSOCKET_ADDRESS = `ws:${__DEV__
  ? "10.0.2.2:5000/picar_action?token=secret"
  : "raspberrypi.local:5000"}`;

/* const PICAR_WEBSOCKET_ADDRESS = "ws://echo.websocket.org";*/

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

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Controls"
  }),
  provideState({
    initialState: () => ({
      picarEnabled: false,
      time: 0
    }),
    effects: {
      picarEnabled: update(state => ({ picarEnabled: true })),
      incrementTime: update(({ time }) => ({ time: time + 1 }))
    }
  }),
  injectState,
  lifecycle({
    componentDidMount() {
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
      props.inputSubject.next({ action: direction })
  })
);

const PicarControlView = ({
  dispatch,
  submitDirection,
  effects,
  state: { directions, picarEnabled, time }
}: {
  dispatch: () => void,
  submitDirection: Direction => void,
  state: ControlViewState,
  effects: {
    picarEnabled: () => void
  }
}) =>
  <ContainerView>
    <Timer time={time} />
    <ControlPad handlePress={submitDirection} />
  </ContainerView>;

export default enhance(PicarControlView);
