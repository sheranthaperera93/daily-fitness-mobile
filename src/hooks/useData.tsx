import React, { useCallback, useContext, useEffect, useState } from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  IArticle,
  ICategory,
  IProduct,
  IUser,
  IUseData,
  ITheme,
  IWorkout
} from '../constants/types';

import {
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
  WORKOUTS,
} from '../constants/mocks';
import { light, dark } from '../constants';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<IUser[]>();
  const [following, setFollowing] = useState<IProduct[]>(FOLLOWING);
  const [trending, setTrending] = useState<IProduct[]>(TRENDING);
  const [categories, setCategories] = useState<ICategory[]>(CATEGORIES);
  const [articles, setArticles] = useState<IArticle[]>(ARTICLES);
  const [article, setArticle] = useState<IArticle>({});
  const [workouts, setWorkouts] = useState<IWorkout[]>(WORKOUTS);

  // get isDark mode from storage
  const getIsDark = useCallback(async () => {
    // get preferance gtom storage
    const isDarkJSON = await Storage.getItem('isDark');

    if (isDarkJSON !== null) {
      // set isDark / compare if has updated
      setIsDark(JSON.parse(isDarkJSON));
    }
  }, [setIsDark]);

  // handle isDark mode
  const handleIsDark = useCallback(
    (payload: boolean) => {
      // set isDark / compare if has updated
      setIsDark(payload);
      // save preferance to storage
      Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setIsDark],
  );

  // handle users / profiles
  const handleUsers = useCallback(
    (payload: IUser[]) => {
      // set users / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(users)) {
        setUsers({ ...users, ...payload });
      }
    },
    [users, setUsers],
  );

  // handle user
  const handleUser = useCallback(
    async (payload: IUser | null) => {
      // set user / compare if has updated
      if (!payload) {
        await Storage.removeItem('user');
        setUser(undefined);
      } else {
        if (JSON.stringify(payload) !== JSON.stringify(user)) {
          await Storage.setItem('user', JSON.stringify(payload))
          setUser(payload);
        }
      }
    },
    [user, setUser],
  );

  // get user  from storage
  const getUser = useCallback(async () => {
    // get preferance gtom storage
    const userJSON = await Storage.getItem('user');
    if (userJSON !== null) {
      // set isDark / compare if has updated
      setUser(JSON.parse(userJSON));
    } else {
      await Storage.removeItem('user');
      setUser(undefined);
    }
  }, [setUser]);

  // handle Article
  const handleArticle = useCallback(
    (payload: IArticle) => {
      // set article / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(article)) {
        setArticle(payload);
      }
    },
    [article, setArticle],
  );

  // get initial data for: isDark & language
  useEffect(() => {
    getIsDark();
    getUser();
  }, [getIsDark, getUser]);

  // change theme based on isDark updates
  useEffect(() => {
    setTheme(isDark ? dark : light);
  }, [isDark]);

  const contextValue = {
    isDark,
    handleIsDark,
    theme,
    setTheme,
    user,
    users,
    handleUsers,
    handleUser,
    following,
    setFollowing,
    trending,
    setTrending,
    categories,
    setCategories,
    articles,
    setArticles,
    article,
    handleArticle,
    workouts,
    setWorkouts
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
