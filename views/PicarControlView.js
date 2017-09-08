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
import { ReplaySubject } from "rxjs";
import websocketConnect from "rxjs-websockets";

import styled from "styled-components/native";

import { PICAR_WEBSOCKET_ADDRESS } from "../config";

import ControlPad, { type Direction } from "../components/ControlPad";
import PicarConnectionIndicator from "../components/PicarConnectionIndicator";
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
  provideState({
    initialState: () => ({
      picarEnabled: false
    }),
    effects: {
      setPicarEnabled: update((state, picarEnabled: boolean) => ({
        picarEnabled
      }))
    }
  }),
  injectState
);

const FinishContestButton = styled.Text`
  color: green;
  font-size: 24px;
`;

type ControlViewProps = {
  state: ControlViewState,
  effects: {
    incrementTime: () => void,
    setPicarEnabled: boolean => void
  },
  navigation: {
    navigate: string => void
  }
};

class PicarControlView extends React.Component<void, ControlViewProps, void> {
  stopTimer: ?() => void;
  inputSubject: any;
  messageSubscription: any;

  connectToWebsocket = () => {
    const inputSubject = new ReplaySubject().throttleTime(1000);
    const { messages, connectionStatus } = websocketConnect(
      PICAR_WEBSOCKET_ADDRESS,
      inputSubject
    );
    const messageSubscription = messages.subscribe(message => {
      if (message.error) {
        if (this.stopTimer != null) {
          this.stopTimer();
        }
        return console.error(message.error);
      }
    });

    // Setup timer
    const timer = setInterval(this.props.effects.incrementTime, 100);

    this.stopTimer = () => {
      clearInterval(timer);
    };

    this.messageSubscription = messageSubscription;
    this.inputSubject = inputSubject;
  };

  _tryReconnect = () => {
    try {
      this.connectToWebsocket();
      this.props.effects.setPicarEnabled(true);
    } catch (e) {}
  };

  submitDirection = (direction: Direction) =>
    this.inputSubject.next({ action: direction });

  finishContest = () => {
    if (this.stopTimer != null) {
      this.stopTimer();
    }
    this.props.navigation.navigate("Signup");
  };

  componentDidMount() {
    try {
      this.connectToWebsocket();
      this.props.effects.setPicarEnabled(true);
    } catch (e) {}
  }

  componentWillUnmount() {
    this.props.effects.setPicarEnabled(false);
    if (this.stopTimer != null) {
      this.stopTimer();
      this.messageSubscription.unsubscribe();
    }
  }
  render() {
    const { state: { directions, time, picarEnabled } } = this.props;
    return (
      <ContainerView>
        <Title>
          Use the arrow buttons to control the car and bring it safely through
          the course!
        </Title>
        <ControlPad handlePress={this.submitDirection} />
        <Timer time={time} />
        <TouchableNativeFeedback onPress={this.finishContest}>
          <FinishButtonView>
            <MarginText>Finish contest</MarginText>
          </FinishButtonView>
        </TouchableNativeFeedback>
        <PicarConnectionIndicator
          picarEnabled={picarEnabled}
          tryReconnect={this._tryReconnect}
        />
      </ContainerView>
    );
  }
}

export default enhance(PicarControlView);
