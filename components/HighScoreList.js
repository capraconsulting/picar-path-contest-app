// @flow
import React from "react";

import { FlatList, View, Text } from "react-native";
import styled from "styled-components/native";

const BigText = styled.Text`font-size: 40px;`;

type HighScoreEntryShape = {
  score: number,
  username: string
};

const Righted = styled.Text`
  font-size: 32px;
  text-align: right;
`;

const Centered = styled.Text`
  font-size: 32px;
  text-align: right;
  width: 200px;
  padding-right: 20px;
`;

const Lefted = styled.Text`
  font-size: 32px;
  text-align: right;
`;

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
  line-height: 70px;
`;

const HighScoreEntry = ({
  score,
  username,
  rank,
  currentUser
}: {
  score: number,
  username: string,
  rank: number,
  currentUser: ?string
}) => (
  <HighScoreListFlexContainer current={currentUser === username}>
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

const HighScoreList = ({
  highScores,
  currentUser
}: {
  highScores: Array<HighScoreEntryShape>,
  currentUser: string
}) => (
  <ContainerView>
    <FlatList
      data={highScores}
      ListHeaderComponent={<HighScoreTitle>Highscores</HighScoreTitle>}
      keyExtractor={(item, index) => "" + index}
      getItemLayout={(data, index) => ({
        length: 32,
        offset: 32,
        index
      })}
      initialScrollIndex={10}
      renderItem={({
        item,
        index
      }: {
        item: HighScoreEntryShape,
        index: number
      }) => (
        <HighScoreEntry {...item} rank={index + 1} currentUser={currentUser} />
      )}
    />
  </ContainerView>
);

export default HighScoreList;
