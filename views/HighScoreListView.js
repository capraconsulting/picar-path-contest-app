import React from "react";

import { View, Text, TouchableNativeFeedback } from "react-native";

import styled from "styled-components/native";

import { gql, graphql } from "react-apollo";

import {
  pure,
  compose,
  setStatic,
  mapProps,
  withHandlers,
  branch
} from "recompose";

import R from "ramda";

import { injectState } from "freactal";

import { NavigationActions } from "react-navigation";

import Spinner from "react-native-loading-spinner-overlay";
import HighScoreList from "../components/HighScoreList";

const ResetButton = styled.View`
  background-color: yellow;
  border-radius: 10px;
  margin-left: 500px;
  width: 100px;
  height: 100px;
`;

const StartButtonView = styled.View`
  margin-left: 300px;
  margin-right: 300px;
  background-color: darkseagreen;
  border-radius: 5px;
`;

const MarginText = styled.Text`
  margin: 10px;
  text-align: center;
  font-size: 32px;
`;

const HighScoreListQuery = gql`
  query allHighScoreEntriesLowerInclusive($currentScore: Int!) {
    allHighScoreEntries(
      filter: { score_lte: $currentScore }
      orderBy: score_ASC
    ) {
      username
      score
    }
  }
`;

const HighScoreListQueryTopFive = gql`
  query allHighScoreEntries {
    allHighScoreEntries(orderBy: score_ASC, first: 5) {
      username
      score
    }
  }
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Highscores"
  }),
  injectState,
  branch(
    ({ navigation: { state: { params: { fetchAll = false } } } }) => fetchAll,
    graphql(HighScoreListQueryTopFive, {
      options: { fetchPolicy: "network-only" }
    }),
    graphql(HighScoreListQuery, {
      options: ({ state: { time } }) => ({
        variables: { currentScore: time },
        fetchPolicy: "network-only"
      })
    })
  ),
  withHandlers({
    handlePressReset: ({
      effects: { resetState },
      navigation: { dispatch }
    }) => async () => {
      await resetState();
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Greeting" })]
        })
      );
    }
  })
);

const renameTimeToScore = obj => ({
  ...obj,
  score: obj.time
});

const HighScoreListView = ({
  navigation: { state: { params: { fetchAll = false } } },
  data: { loading, allHighScoreEntries },
  state: currentUser,
  handlePressReset
}) => (
  <View style={{ flex: 1 }}>
    <Spinner color="blue" visible={loading} />

    {!loading && (
      <HighScoreList
        showCurrentUser={!fetchAll}
        highScores={allHighScoreEntries}
        currentUser={renameTimeToScore(currentUser)}
      />
    )}
    <TouchableNativeFeedback onPress={handlePressReset}>
      <StartButtonView>
        <MarginText>New race</MarginText>
      </StartButtonView>
    </TouchableNativeFeedback>
  </View>
);

export default enhance(HighScoreListView);
