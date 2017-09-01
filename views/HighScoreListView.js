import React from "react";
import { gql, graphql } from "react-apollo";

import { compose, setStatic } from "recompose";

import { injectState } from "freactal";

import HighScoreList from "../components/HighScoreList";

const HighScoreListQuery = gql`
  query {
    allHighScoreEntries(orderBy: score_ASC) {
      username
      score
    }
  }
`;

const enhance = compose(
  setStatic("navigationOptions", {
    title: "Higscores"
  }),
  graphql(HighScoreListQuery),
  injectState
);

const HighScoreListView = ({
  data: { allHighScoreEntries },
  state: { username }
}) => <HighScoreList highScores={allHighScoreEntries} currentUser={username} />;

export default enhance(HighScoreListView);
