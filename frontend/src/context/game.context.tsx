import React, { createContext, useState, useMemo, useContext } from "react";
import { Game } from "../utils/types";

export const GameContext = createContext<{
  game: Game | null;
  setGame: (game: Game) => void;
} | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameContextProvider");
  }
  return context;
};

export const GameContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [game, setGame] = useState<Game | null>(null);

  const value = useMemo(() => ({ game, setGame }), [game, setGame]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
