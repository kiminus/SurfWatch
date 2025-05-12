import { createContext } from 'react';
import { UserProfile } from '../models/user';
import { ScreenNavigator } from '../models/shared';
import { Site } from '../models/site';

export type AppContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  currentScreen: ScreenNavigator;
  navigate: (screen: ScreenNavigator) => void;
  currentSite: Site | null;
  setCurrentSite: (site: Site | null) => void;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  currentScreen: ScreenNavigator.Login,
  navigate: () => {},
  currentSite: null,
  setCurrentSite: () => {},
});
