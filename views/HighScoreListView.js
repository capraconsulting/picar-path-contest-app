import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { gql, graphql } from "react-apollo";

import { pure, compose, setStatic, mapProps } from "recompose";

import R from "ramda";

import { injectState } from "freactal";

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
    title: "High scores"
  }),
  injectState,
  graphql(HighScoreListQuery, {
    options: ({ state: { time } }) => ({
      variables: { currentScore: time }
    })
  })
);

const HighScoreListView = ({
  data: { loading, allHighScoreEntries },
  state: currentUser
}) => {
  if (loading) {
    return <Spinner />;
  }

  return (
    <HighScoreList highScores={allHighScoreEntries} currentUser={currentUser} />
  );
};

export default enhance(HighScoreListView);
