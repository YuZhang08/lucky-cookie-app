import React, { useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Props = {
  text: string;
  visible: boolean;
};

export const FortunePaper = ({ text, visible }: Props): React.JSX.Element => {
  const [displayed, setDisplayed] = useState("");
  const fade = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (!visible) {
      setDisplayed("");
      fade.setValue(0);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 22);

    Animated.timing(fade, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true
    }).start();

    return () => clearInterval(timer);
  }, [text, visible, fade]);

  return (
    <Animated.View
      style={[
        styles.paper,
        {
          opacity: fade,
          transform: [
            {
              translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [14, 0] })
            }
          ]
        }
      ]}
    >
      <View style={styles.line} />
      <Text style={styles.text}>{displayed}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  paper: {
    marginTop: 16,
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e9d8b8"
  },
  line: {
    height: 2,
    backgroundColor: "#e7d7b7",
    marginBottom: 10,
    borderRadius: 2
  },
  text: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    fontWeight: "500"
  }
});
