import StorybookUI from "./storybook";

import RootView from "./views/RootView"

module.exports = __DEV__ ? StorybookUI : RootView;
