import React from "react";

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";

import { StackNavigator } from "react-navigation";

import styled from "styled-components/native";

import { provideState, update } from "freactal";

import { GRAPHCOOL_ENDPOINT, GRAPHCOOL_AUTH_TOKEN } from "../config";

import SignupView from "./SignupView";
import GreetingView from "./GreetingView";
import PicarControlView from "./PicarControlView";
import HighScoreListView from "./HighScoreListView";

const networkInterface = createNetworkInterface({
  uri: GRAPHCOOL_ENDPOINT,
  opts: {
    headers: {
      Authorization: `Bearer ${GRAPHCOOL_AUTH_TOKEN}`
    }
  }
});

const client = new ApolloClient({
  networkInterface
});

const provide = provideState({
  initialState: () => ({
    time: 0,
    username: "",
    phoneNo: ""
  }),
  effects: {
    incrementTime: update(({ time }) => ({ time: time + 1 })),
    setUsername: update((state, username) => ({ username })),
    setPhoneNo: update((state, phoneNo) => ({ phoneNo }))
  }
});

const Navigator = provide(
  StackNavigator(
    {
      Signup: {
        screen: SignupView
      },
      Greeting: {
        screen: GreetingView
      },
      Controls: {
        screen: PicarControlView
      },
      HighScoreList: {
        screen: HighScoreListView
      }
    },
    { initialRouteName: "Greeting" }
  )
);

const RootView = () => (
  <ApolloProvider client={client}>
    <Navigator />
  </ApolloProvider>
);

export default RootView;
