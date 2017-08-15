// @flow
import React from "react";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import ControlPad, { type Direction } from "../components/ControlPad";

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
  ? "10.0.2.2:9000"
  : "raspberrypi.local:5000"}`;

const PICAR_WEBSOCKET_ADDRESS = "ws://echo.websocket.org";

const ContainerView = styled.View`
  flex: 1;
  justify-content: center;
`;

type ControlViewState = {
  directions: Array<Direction>,
  picarEnabled: boolean
};

// Presentational components
const Title = styled.Text`
  font-size: 48px;
  color: firebrick;
`;

const ArrowButton = ({
  direction,
  handlePress
}: {
  direction: Direction,
  handlePress: Direction => void
}) =>
  <TouchableOpacity onPress={() => handlePress(direction)}>
    <Icon name={`arrow-with-circle-${direction}`} size={200} />
  </TouchableOpacity>;

const ButtonGrid = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Controls"
  }),
  provideState({
    initialState: () => ({
      picarEnabled: false
    }),
    effects: {
      picarEnabled: update(state => ({ picarEnabled: true }))
    }
  }),
  injectState,
  lifecycle({
    componentDidMount() {
      const inputSubject = new QueueingSubject();
      const { messages, connectionStatus } = websocketConnect(
        PICAR_WEBSOCKET_ADDRESS,
        inputSubject
      );
      const messageSubscription = messages.subscribe(message => {
        Alert.alert(JSON.stringify(message));
      });

      this.setState({ messageSubscription, inputSubject });
    },
    componentWillUnmount() {
      this.state.messageSubscription.unsubscribe();
    }
  }),
  withHandlers({
    submitDirection: props => (direction: Direction) =>
      props.inputSubject.next({ direction })
  })
);

const PicarControlView = ({
  dispatch,
  submitDirection,
  effects,
  state: { directions, picarEnabled }
}: {
  dispatch: () => void,
  submitDirection: Direction => void,
  state: ControlViewState,
  effects: {
    picarEnabled: () => void
  }
}) =>
  <ContainerView>
    <ControlPad handlePress={submitDirection} />
  </ContainerView>;

export default enhance(PicarControlView);
