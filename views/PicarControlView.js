// @flow
import React from "react";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

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

let PICAR_WEBSOCKET_ADDRESS = `ws://${__DEV__
  ? "10.0.2.2:9000"
  : "raspberrypi.local:5000"}`;

PICAR_WEBSOCKET_ADDRESS = "ws://echo.websocket.org";

const ContainerView = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

type Direction = "up" | "down" | "right" | "left";

type ControlViewState = {
  directions: Array<Direction>,
  picarEnabled: boolean
};

// Presentational components
const Title = styled.Text`
  font-size: 48px;
  color: firebrick;
`;

const Arrow = ({ direction }: { direction: Direction }) =>
  <Icon name={`arrow-with-circle-${direction}`} color="green" size={60} />;

const ArrowButton = ({
  direction,
  handlePress
}: {
  direction: Direction,
  handlePress: Direction => void
}) =>
  <TouchableOpacity onPress={() => handlePress(direction)}>
    <Icon name={`arrow-with-circle-${direction}`} size={60} />
  </TouchableOpacity>;

const PlayButton = ({ handlePress, enabled = false }) =>
  <TouchableOpacity style={{ alignSelf: "center" }} onPress={handlePress}>
    <Icon
      name={`controller-${enabled ? "stop" : "play"}`}
      size={60}
      color={`${enabled ? "firebrick" : "forestgreen"}`}
    />
  </TouchableOpacity>;

const ButtonGrid = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-content: flex-end;
`;

const DirectionList = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Controls"
  }),
  provideState({
    initialState: ({
      initialDirections = []
    }: {
      initialDirections: Array<Direction>
    }) => ({
      directions: initialDirections,
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
    <Title>Tap the buttons to compose your "path"</Title>
    <DirectionList>
      {directions.map((direction, index) =>
        <Arrow direction={direction} key={`${direction}-${index}`} />
      )}
    </DirectionList>
    <ButtonGrid>
      <ArrowButton direction="up" handlePress={submitDirection} />
      <ArrowButton direction="down" handlePress={submitDirection} />
      <ArrowButton direction="right" handlePress={submitDirection} />
      <ArrowButton direction="left" handlePress={submitDirection} />
    </ButtonGrid>
    <PlayButton handlePress={effects.picarEnabled} enabled={picarEnabled} />
  </ContainerView>;

export default enhance(PicarControlView);
