import React from 'react';

import {light, dark} from '../constants/';
import {ITheme, IThemeProvider} from '../constants/types';

export const ThemeContext = React.createContext({
  theme: light,
  setTheme: (input:any) => {console.log(input)},
});

export const ThemeProvider = ({
  children,
  theme = light,
  setTheme = (input) => {
    console.log(input);
  },
}: IThemeProvider) => {
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme(): ITheme {
  const {theme} = React.useContext(ThemeContext);
  return theme;
}
