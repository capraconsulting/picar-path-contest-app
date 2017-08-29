import React from "react";

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";

import { StackNavigator } from "react-navigation";

import styled from "styled-components/native";

import { GRAPHCOOL_ENDPOINT, GRAPHCOOL_AUTH_TOKEN } from "../config";

import SignupView from "./SignupView";
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

const Navigator = StackNavigator(
  {
    Signup: {
      screen: SignupView
    },
    Controls: {
      screen: PicarControlView
    },
    HighScoreList: {
      screen: HighScoreListView
    }
  },
  { initialRouteName: "Signup" }
);

const RootView = () => (
  <ApolloProvider client={client}>
    <Navigator />
  </ApolloProvider>
);

export default RootView;
