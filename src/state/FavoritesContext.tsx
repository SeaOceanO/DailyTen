import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { FavoriteNewsItem, NewsItem } from '../data/mockNews';

type FavoritesContextValue = {
  favorites: FavoriteNewsItem[];
  isFavorite: (id: string) => boolean;
  addFavorite: (item: NewsItem) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: NewsItem) => void;
};

const favoritesStorageKey = 'dailyten:favorites';
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritesById, setFavoritesById] = useState<Record<string, FavoriteNewsItem>>({});

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(favoritesStorageKey)
      .then((storedFavorites) => {
        if (!mounted || !storedFavorites) {
          return;
        }

        const parsedFavorites = JSON.parse(storedFavorites) as FavoriteNewsItem[];

        if (Array.isArray(parsedFavorites)) {
          setFavoritesById(indexFavorites(parsedFavorites));
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const persistFavorites = useCallback((nextFavoritesById: Record<string, FavoriteNewsItem>) => {
    AsyncStorage.setItem(
      favoritesStorageKey,
      JSON.stringify(getSortedFavorites(nextFavoritesById)),
    ).catch(() => undefined);
  }, []);

  const addFavorite = useCallback(
    (item: NewsItem) => {
      setFavoritesById((current) => {
        if (current[item.id]) {
          return current;
        }

        const next = {
          ...current,
          [item.id]: {
            ...item,
            favoritedAt: new Date().toISOString(),
          },
        };

        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavoritesById((current) => {
        if (!current[id]) {
          return current;
        }

        const next = { ...current };
        delete next[id];
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites],
  );

  const toggleFavorite = useCallback(
    (item: NewsItem) => {
      setFavoritesById((current) => {
        const next = { ...current };

        if (next[item.id]) {
          delete next[item.id];
        } else {
          next[item.id] = {
            ...item,
            favoritedAt: new Date().toISOString(),
          };
        }

        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites],
  );

  const isFavorite = useCallback(
    (id: string) => Boolean(favoritesById[id]),
    [favoritesById],
  );

  const value = useMemo(
    () => ({
      favorites: getSortedFavorites(favoritesById),
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [addFavorite, favoritesById, isFavorite, removeFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);

  if (!value) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return value;
}

function indexFavorites(favorites: FavoriteNewsItem[]) {
  return favorites.reduce<Record<string, FavoriteNewsItem>>((indexedFavorites, favorite) => {
    if (favorite?.id && favorite?.dateKey && favorite?.category && favorite?.zh && favorite?.en) {
      indexedFavorites[favorite.id] = favorite;
    }

    return indexedFavorites;
  }, {});
}

function getSortedFavorites(favoritesById: Record<string, FavoriteNewsItem>) {
  return Object.values(favoritesById).sort((first, second) =>
    second.favoritedAt.localeCompare(first.favoritedAt),
  );
}
