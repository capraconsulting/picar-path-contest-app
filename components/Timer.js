// @flow
import React from "react";
import { Text } from "react-native";

import styled from "styled-components/native";

type TimerProps = {
  time: number,
  unit?: number
};

const BigBoldText = styled.Text`
  font-size: 60px;
  font-weight: bold;
`;

const Timer = ({ time, unit = 10 }: TimerProps) =>
  <BigBoldText>
    {`${Math.floor(time / unit)}.${time % unit}`}
  </BigBoldText>;

export default Timer;
