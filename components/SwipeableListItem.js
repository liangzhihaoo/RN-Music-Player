import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSwipeableList } from "../context/SwipeableListContext";

const SWIPE_THRESHOLD = 50;
const SNAP_OPEN_THRESHOLD = 80;
const DELETE_BUTTON_WIDTH = 60;

const SwipeableListItem = ({ itemId, children, onDelete }) => {
  const { openedItemId, openSwiped, closeSwiped } = useSwipeableList();
  const translateX = useRef(new Animated.Value(0)).current;

  // Close this item when another item is opened
  useEffect(() => {
    if (openedItemId !== itemId && openedItemId !== null) {
      // Another item was opened, close this one
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  }, [openedItemId, itemId]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX: tx } = event.nativeEvent;

      // Only allow swipe left (negative values)
      if (tx < -SNAP_OPEN_THRESHOLD) {
        // Snap to open position
        Animated.spring(translateX, {
          toValue: -DELETE_BUTTON_WIDTH,
          useNativeDriver: true,
          friction: 8,
        }).start();
        openSwiped(itemId);
      } else {
        // Snap back to closed
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
        if (openedItemId === itemId) {
          closeSwiped();
        }
      }
    }
  };

  const handleDelete = () => {
    // Close the swipe first
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start(() => {
      closeSwiped();
      onDelete();
    });
  };

  return (
    <View style={styles.container}>
      {/* Delete button (behind the item) */}
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.itemContent,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [-DELETE_BUTTON_WIDTH, 0],
                    outputRange: [-DELETE_BUTTON_WIDTH, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#fff",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 1,
    top: 1,
    bottom: 1,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: DELETE_BUTTON_WIDTH,
    height: "100%",
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    backgroundColor: "#fff",
  },
});

export default SwipeableListItem;
