import React from "react";

import { View } from "react-native";

import { gql, graphql } from "react-apollo";

import { pure, compose, setStatic, mapProps } from "recompose";

import R from "ramda";

import { injectState } from "freactal";

import Spinner from "react-native-loading-spinner-overlay";
import HighScoreList from "../components/HighScoreList";

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

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Highscores"
  }),
  injectState,
  graphql(HighScoreListQuery, {
    options: ({ state: { time } }) => ({
      variables: { currentScore: time }
    })
  })
);

const renameTimeToScore = obj => ({
  ...obj,
  score: obj.time
});

const HighScoreListView = ({
  data: { loading, allHighScoreEntries },
  state: currentUser
}) => (
  <View style={{ flex: 1 }}>
    <Spinner color="blue" visible={loading} />

    {!loading && (
      <HighScoreList
        highScores={allHighScoreEntries}
        currentUser={renameTimeToScore(currentUser)}
      />
    )}
  </View>
);

export default enhance(HighScoreListView);
