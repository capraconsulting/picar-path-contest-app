// @flow
import React from "react";

import { gql, graphql } from "react-apollo";

import { Alert, View, Text, TouchableNativeFeedback } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { compose, setStatic, lifecycle, pure } from "recompose";
import { provideState, injectState, update } from "freactal";

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/throttleTime";

import styled from "styled-components/native";

import { PICAR_WEBSOCKET_ADDRESS, PICAR_PING_ENDPOINT } from "../config";

import ControlPad, { type Direction } from "../components/ControlPad";
import PicarConnectionIndicator from "../components/PicarConnectionIndicator";
import Timer from "../components/Timer";

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
  background-color: ${({ disabled = false }) =>
    disabled ? "darkgrey" : "darkseagreen"};
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
    resetTime: () => void,
    incrementTime: () => void,
    setPicarEnabled: boolean => void
  },
  navigation: {
    navigate: string => void
  }
};

const websocketPromise = async (url, onClose = () => {}) => {
  const ws = new WebSocket(url);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("WebSocket connection timed out");
    }, 2000);
    ws.addEventListener("open", event => {
      clearTimeout(timeout);
      const subject = new Subject();
      subject.throttleTime(1000).subscribe(data => {
        ws.send(JSON.stringify(data));
      });
      resolve({
        sendData(data) {
          subject.next(data);
        },
        close() {
          subject.unsubscribe();
          ws.close();
        }
      });
    });
    ws.addEventListener("close", onClose);
  });
};

class PicarControlView extends React.Component<void, ControlViewProps, void> {
  stopTimer: ?() => void;
  inputSubject: any;
  messageSubscription: any;
  sendData: ?({ action: Direction }) => void;
  closeWebsocket: ?() => void;

  connectToWebSocket = async () => {
    try {
      const {
        sendData,
        close
      } = await websocketPromise(PICAR_WEBSOCKET_ADDRESS, () => {
        this.props.effects.setPicarEnabled(false);
        if (this.stopTimer) {
          this.stopTimer();
        }
      });
      await this.props.effects.setPicarEnabled(true);
      this.sendData = sendData;
      this.closeWebsocket = close;
      // Setup timer
      const timer = setInterval(() => {
        this.props.effects.incrementTime();
      }, 100);
      this.stopTimer = () => {
        clearInterval(timer);
      };
    } catch (err) {}
  };

  submitDirection = (direction: Direction) => {
    if (!this.sendData) {
      return;
    }
    this.sendData({ action: direction });
  };

  finishContest = () => {
    if (this.stopTimer != null) {
      this.stopTimer();
      if (this.closeWebsocket) {
        this.closeWebsocket();
      }
    }
    this.props.navigation.navigate("Signup");
  };

  componentDidMount() {
    this.props.effects.resetTime();
    this.connectToWebSocket();
  }

  componentWillUnmount() {
    this.props.effects.resetTime();
    this.props.effects.setPicarEnabled(false);

    if (this.closeWebsocket != null) {
      this.closeWebsocket();
    }
    if (this.stopTimer != null) {
      this.stopTimer();
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
        <ControlPad enabled={true} handlePress={this.submitDirection} />
        <Timer time={time} />
        <TouchableNativeFeedback onPress={this.finishContest}>
          <FinishButtonView disabled={!picarEnabled}>
            <MarginText>Finish contest</MarginText>
          </FinishButtonView>
        </TouchableNativeFeedback>
        <PicarConnectionIndicator
          picarEnabled={picarEnabled}
          tryReconnect={this.connectToWebSocket}
        />
      </ContainerView>
    );
  }
}

export default enhance(PicarControlView);
