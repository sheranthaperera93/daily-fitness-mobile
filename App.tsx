import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from "react-native";

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

LogBox.ignoreLogs(["EventEmitter.removeListener", "EventEmitter.addListener"]);

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  );
}
