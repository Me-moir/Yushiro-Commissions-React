import React, { createContext, useState, useContext } from 'react';

const ExpandedCardsContext = createContext();

export function ExpandedCardsProvider({ children }) {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <ExpandedCardsContext.Provider value={{ expandedCards, toggleCardExpansion }}>
      {children}
    </ExpandedCardsContext.Provider>
  );
}

export function useExpandedCards() {
  return useContext(ExpandedCardsContext);
}