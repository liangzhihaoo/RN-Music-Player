import React, { createContext, useContext, useState } from 'react';

const SwipeableListContext = createContext();

export const useSwipeableList = () => {
  const context = useContext(SwipeableListContext);
  if (!context) {
    throw new Error('useSwipeableList must be used within SwipeableListProvider');
  }
  return context;
};

export const SwipeableListProvider = ({ children }) => {
  const [openedItemId, setOpenedItemId] = useState(null);

  const openSwiped = (itemId) => {
    setOpenedItemId(itemId);
  };

  const closeSwiped = () => {
    setOpenedItemId(null);
  };

  const closeAll = () => {
    setOpenedItemId(null);
  };

  return (
    <SwipeableListContext.Provider
      value={{
        openedItemId,
        openSwiped,
        closeSwiped,
        closeAll,
      }}
    >
      {children}
    </SwipeableListContext.Provider>
  );
};
