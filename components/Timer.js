// @flow
import React from "react";
import { Text } from "react-native";

import styled from "styled-components/native";
import { formatResultTime } from "../utils";

type TimerProps = {
  time: number,
  unit?: number
};

const BigBoldText = styled.Text`
  font-size: 60px;
  font-weight: bold;
`;

const Timer = ({ time, unit = 10 }: TimerProps) => {
  return <BigBoldText>{formatResultTime(time, unit)}</BigBoldText>;
};

export default Timer;
