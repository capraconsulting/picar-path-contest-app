import React from "react";
import styled from "styled-components/native";

const PowerLight = styled.View`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  margin-left: 50px;
  background-color: ${({ enabled = false }) => (enabled ? "green" : "red")};
`;

export default PowerLight;
