import React from "react";
import { gql, graphql } from "react-apollo";

import { compose, setStatic } from "recompose";

import HighScoreList from "../components/HighScoreList";

const HighScoreListQuery = gql`
  {
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
  graphql(HighScoreListQuery)
);

const HighScoreListView = ({ data: { allHighScoreEntries } }) => (
  <HighScoreList highScores={allHighScoreEntries} />
);

export default enhance(HighScoreListView);
