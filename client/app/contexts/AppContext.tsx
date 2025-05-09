import { createContext } from 'react';
import { UserProfile } from '../models/user';
import { ScreenNavigator } from '../models/shared';

type AppContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  currentScreen: ScreenNavigator;
  navigate: (screen: ScreenNavigator) => void;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  currentScreen: ScreenNavigator.Login,
  navigate: () => {},
});
