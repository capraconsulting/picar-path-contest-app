import React from "react";
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
    title: "Higsh scores"
  }),
  injectState,
  graphql(HighScoreListQuery, {
    options: ({ state: { score: currentScore } }) => ({
      variables: { currentScore }
    })
  }),
  pure
);

const HighScoreListView = ({
  data: { allHighScoreEntries },
  state: currentUser
}) => (
  <HighScoreList highScores={allHighScoreEntries} currentUser={currentUser} />
);

export default enhance(HighScoreListView);
