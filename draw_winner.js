#!/usr/bin/env node

const { GraphQLClient } = require("graphql-request");
const R = require("ramda");
const chalk = require("chalk");

const random = require("random-js")();

const {
  GRAPHCOOL_AUTH_TOKEN,
  GRAPHCOOL_ENDPOINT
} = require("./graphcool-config");

const getUniqueUsers = R.pipe(
  R.prop("allHighScoreEntries"),
  R.uniqBy(R.prop("phoneNo"))
);

const query = `query {
  allHighScoreEntries {
    username
    score
    phoneNo
  }
}`;

const run = async () => {
  const client = new GraphQLClient(GRAPHCOOL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${GRAPHCOOL_AUTH_TOKEN}`
    }
  });

  const data = await client.request(query);
  const uniqueUsers = getUniqueUsers(data);

  const winner = random.pick(uniqueUsers);

  /* console.log(JSON.stringify(winner));*/
  console.log(chalk`And the winner is: {green ${winner.username}}!`);
  console.log(chalk`Score: {yellow ${winner.score}}`);
  console.log(chalk`Phone number: {yellow ${winner.phoneNo}}`);
};

run();
