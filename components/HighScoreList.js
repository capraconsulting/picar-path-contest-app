// @flow
import React from "react";

import { FlatList, View, Text } from "react-native";
import styled from "styled-components/native";

import R from "ramda";
import { pure, compose, setStatic, mapProps } from "recompose";

const BigText = styled.Text`font-size: 40px;`;

type HighScoreEntryShape = {
  score: number,
  username: string
};

const Righted = styled.Text`
  font-size: 32px;
  text-align: right;
  padding-left: 20px;
`;

const Centered = styled.Text`
  font-size: 32px;
  text-align: right;
  width: 400px;
`;

const Lefted = styled.Text`
  font-size: 32px;
  text-align: right;
  padding-left: 20px;
`;

const SeparatorContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const SeparatorDot = styled.Text`
  font-size: 32px;
  text-align: center;
`;

const HighScoreSeparator = () => (
  <SeparatorContainer>
    <SeparatorDot>•</SeparatorDot>
    <SeparatorDot>•</SeparatorDot>
    <SeparatorDot>•</SeparatorDot>
  </SeparatorContainer>
);

const HighScoreListFlexContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ current }) => (current ? "yellow" : "transparent")};
`;

const HighScoreTitle = styled.Text`
  font-size: 40px;
  color: firebrick;
  align-self: center;
`;

const HighScoreEntry = ({
  score,
  username,
  rank
}: {
  score: number,
  username: string,
  rank: number
}) => (
  <HighScoreListFlexContainer>
    <Lefted>
      <Text>{rank}</Text>
    </Lefted>
    <Centered>
      <Text>{username}</Text>
    </Centered>
    <Righted>
      <Text>{score}</Text>
    </Righted>
  </HighScoreListFlexContainer>
);

const ContainerView = styled.View`
  background-color: lightblue;
  flex: 1;
`;

// Helper functions
const sliceOfFive = R.slice(0, 5);

const enhance = compose(
  mapProps(({ highScores, currentUser: { username, score } }) => ({
    totalEntries: highScores.length,
    topHighScoreEntries: sliceOfFive(highScores),
    currentUser: {
      index: R.findIndex(R.propEq("username", username), highScores),
      username,
      score
    }
  })),
  pure
);

const HighScoreList = ({
  totalEntries,
  topHighScoreEntries,
  currentUser
}: {
  totalEntries: number,
  topHighScoreEntries: Array<HighScoreEntryShape>,
  currentUser: {
    score: number,
    username: string,
    index: number
  }
}) => (
  <ContainerView>
    <FlatList
      ListHeaderComponent={<HighScoreTitle>Highscores</HighScoreTitle>}
      data={topHighScoreEntries}
      ListFooterComponent={() =>
        currentUser.index >= 5 && (
          <View>
            {currentUser.index > 5 && <HighScoreSeparator />}
            <HighScoreEntry {...currentUser} rank={currentUser.index + 1} />
          </View>
        )}
      keyExtractor={({ username }) => username}
      renderItem={({ item: highScore, index }) => (
        <HighScoreEntry
          {...highScore}
          rank={index + 1}
          key={highScore.username}
        />
      )}
    />
  </ContainerView>
);

export default enhance(HighScoreList);
