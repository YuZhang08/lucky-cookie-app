import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "../components/ScreenContainer";
import { FortunePaper } from "../components/FortunePaper";
import { useAppStore } from "../store/AppStore";
import { theme } from "../theme";
import { useShakeToCrack } from "../hooks/useShakeToCrack";
import { useCookieAudio } from "../hooks/useCookieAudio";
import { t } from "../i18n";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const COOKIE_WIDTH = 290;
const COOKIE_HEIGHT = 227;
const COOKIE_PHOTO = require("../../assets/images/fortune-cookie-real-cutout.png");
const SPLIT_VARIANTS = [
  {
    left: require("../../assets/images/splits/cookie_left_v1.png"),
    right: require("../../assets/images/splits/cookie_right_v1.png")
  },
  {
    left: require("../../assets/images/splits/cookie_left_v2.png"),
    right: require("../../assets/images/splits/cookie_right_v2.png")
  },
  {
    left: require("../../assets/images/splits/cookie_left_v3.png"),
    right: require("../../assets/images/splits/cookie_right_v3.png")
  }
] as const;
const CRUMB_PARTICLES = [
  { x: -8, y: 8, dx: -36, dy: 70, rotate: -40, size: 7 },
  { x: 2, y: 4, dx: -18, dy: 84, rotate: 28, size: 6 },
  { x: 10, y: 2, dx: 14, dy: 78, rotate: -20, size: 8 },
  { x: -16, y: -2, dx: -46, dy: 62, rotate: 45, size: 6 },
  { x: 14, y: -6, dx: 42, dy: 66, rotate: -32, size: 7 },
  { x: -2, y: 10, dx: 6, dy: 92, rotate: 18, size: 5 },
  { x: 6, y: 8, dx: 24, dy: 88, rotate: -16, size: 6 }
] as const;

const formatRemaining = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const HomeScreen = (): React.JSX.Element => {
  const { state, loading, crackCookie, toggleFavorite, isFavorite, toggleAmbienceMuted, setLanguage } = useAppStore();
  const [cracked, setCracked] = useState(false);
  const [fortune, setFortune] = useState("");
  const [remainingMs, setRemainingMs] = useState(0);
  const [crackVariant, setCrackVariant] = useState({ variantIndex: 0, tilt: 0 });
  const animWiggle = useMemo(() => new Animated.Value(0), []);
  const animCrack = useMemo(() => new Animated.Value(0), []);
  const crumbAnims = useMemo(() => CRUMB_PARTICLES.map(() => new Animated.Value(0)), []);
  const crackingRef = useRef(false);
  const { playCrunch } = useCookieAudio(state.ambienceMuted);
  const lastFortune = state.lastFortuneByLanguage[state.language];

  useEffect(() => {
    const tick = (): void => {
      if (!state.lastFortuneAt) {
        setRemainingMs(0);
        return;
      }
      const elapsed = Date.now() - new Date(state.lastFortuneAt).getTime();
      setRemainingMs(Math.max(0, COOLDOWN_MS - elapsed));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [state.lastFortuneAt]);

  useEffect(() => {
    if (!cracked && !fortune && remainingMs > 0 && lastFortune) {
      setFortune(lastFortune);
    }
  }, [remainingMs, lastFortune, cracked, fortune]);

  useEffect(() => {
    if (cracked) {
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animWiggle, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(animWiggle, { toValue: -1, duration: 420, useNativeDriver: true }),
        Animated.timing(animWiggle, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.delay(550)
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [cracked, animWiggle]);

  const crackNow = useCallback(() => {
    if (crackingRef.current || cracked) {
      return;
    }

    crackingRef.current = true;
    const variantIndex = Math.floor(Math.random() * SPLIT_VARIANTS.length);
    const tilt = -8 + Math.random() * 16;
    setCrackVariant({ variantIndex, tilt });
    crumbAnims.forEach((v) => v.setValue(0));
    const next = crackCookie();
    setFortune(next);
    setCracked(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    void playCrunch();

    Animated.parallel([
      Animated.timing(animCrack, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true
      }),
      ...crumbAnims.map((value, index) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 420 + index * 45,
          useNativeDriver: true
        })
      )
    ]).start(() => {
      crackingRef.current = false;
    });
  }, [cracked, crackCookie, animCrack, crumbAnims, playCrunch]);

  useShakeToCrack({ enabled: !loading && !cracked, onShake: crackNow });

  const reset = (): void => {
    setCracked(false);
    setFortune("");
    animCrack.setValue(0);
    crumbAnims.forEach((v) => v.setValue(0));
  };

  const fortuneSaved = fortune ? isFavorite(fortune) : false;
  const lang = state.language;
  const selectedSplit = SPLIT_VARIANTS[crackVariant.variantIndex];
  const leftAngle = `${-8 - crackVariant.tilt * 0.4}deg`;
  const rightAngle = `${38 + crackVariant.tilt * 0.9}deg`;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{t(lang, "appName")}</Text>
          <Text style={styles.subtitle}>{t(lang, "subtitle")}</Text>
        </View>
        <View style={styles.controlsRow}>
          <View style={styles.langSwitch}>
            <Pressable
              style={[styles.langOption, lang === "en" && styles.langOptionActive]}
              onPress={() => setLanguage("en")}
            >
              <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
            </Pressable>
            <Pressable
              style={[styles.langOption, lang === "zh" && styles.langOptionActive]}
              onPress={() => setLanguage("zh")}
            >
              <Text style={[styles.langText, lang === "zh" && styles.langTextActive]}>中文</Text>
            </Pressable>
          </View>
          <Pressable style={styles.muteBtn} onPress={toggleAmbienceMuted}>
            <Text style={styles.muteLabel}>{state.ambienceMuted ? "Sound Off" : "Sound On"}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.cookieZone}>
        <Pressable onPress={crackNow} disabled={cracked || loading}>
          <Animated.View
            style={[
              styles.cookieWrap,
              {
                transform: [
                  {
                    rotate: animWiggle.interpolate({ inputRange: [-1, 1], outputRange: ["-4deg", "4deg"] })
                  },
                  {
                    scale: animWiggle.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.98, 1, 1.02] })
                  }
                ]
              }
            ]}
          >
            {!cracked && <Image source={COOKIE_PHOTO} style={styles.fullCookiePhoto} resizeMode="cover" />}
            <Animated.View
              style={[
                styles.cookieHalfLayer,
                styles.leftHalf,
                !cracked && styles.hiddenHalf,
                {
                  transform: [
                    {
                      translateX: animCrack.interpolate({ inputRange: [0, 1], outputRange: [0, -52] })
                    },
                    {
                      translateY: animCrack.interpolate({ inputRange: [0, 1], outputRange: [0, -18] })
                    },
                    {
                      rotate: animCrack.interpolate({ inputRange: [0, 1], outputRange: ["0deg", leftAngle] })
                    }
                  ]
                }
              ]}
            >
              <Image source={selectedSplit.left} style={styles.cookiePhoto} resizeMode="cover" />
            </Animated.View>
            <Animated.View
              style={[
                styles.cookieHalfLayer,
                styles.rightHalf,
                !cracked && styles.hiddenHalf,
                {
                  transform: [
                    {
                      translateX: animCrack.interpolate({ inputRange: [0, 1], outputRange: [0, 98] })
                    },
                    {
                      translateY: animCrack.interpolate({ inputRange: [0, 1], outputRange: [0, 34] })
                    },
                    {
                      rotate: animCrack.interpolate({ inputRange: [0, 1], outputRange: ["0deg", rightAngle] })
                    }
                  ]
                }
              ]}
            >
              <Image source={selectedSplit.right} style={styles.cookiePhoto} resizeMode="cover" />
            </Animated.View>
            {CRUMB_PARTICLES.map((crumb, index) => (
              <Animated.View
                // eslint-disable-next-line react/no-array-index-key
                key={`crumb-${index}`}
                style={[
                  styles.crumb,
                  {
                    width: crumb.size,
                    height: crumb.size,
                    borderRadius: crumb.size / 2,
                    opacity: crumbAnims[index].interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 0.85, 0] }),
                    transform: [
                      {
                        translateX: crumbAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [crumb.x, crumb.x + crumb.dx]
                        })
                      },
                      {
                        translateY: crumbAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [crumb.y, crumb.y + crumb.dy]
                        })
                      },
                      {
                        rotate: crumbAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", `${crumb.rotate}deg`]
                        })
                      }
                    ]
                  }
                ]}
              />
            ))}
          </Animated.View>
        </Pressable>

        {cracked && (
          <View style={styles.paperWrap}>
            <FortunePaper text={fortune} visible={cracked} />
            <Pressable style={styles.favoriteBtn} onPress={() => toggleFavorite(fortune)}>
              <Text style={styles.favoriteLabel}>{fortuneSaved ? t(lang, "saved") : t(lang, "saveFortune")}</Text>
            </Pressable>
            <Pressable style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetLabel}>
                {remainingMs > 0
                  ? (lang === "zh" ? `下次开启倒计时 ${formatRemaining(remainingMs)}` : `Next cookie in ${formatRemaining(remainingMs)}`)
                  : t(lang, "openAnother")}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  title: {
    fontSize: 31,
    fontWeight: "800",
    color: theme.colors.accentDark
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.muted
  },
  langSwitch: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ebd5ab",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 2
  },
  langOption: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9
  },
  langOptionActive: {
    backgroundColor: "#ffdca8"
  },
  langText: {
    color: theme.colors.accentDark,
    fontWeight: "600",
    fontSize: 12
  },
  langTextActive: {
    fontWeight: "800"
  },
  muteBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#ebd5ab",
    alignItems: "center",
    justifyContent: "center"
  },
  muteLabel: {
    color: theme.colors.accentDark,
    fontWeight: "700",
    fontSize: 9
  },
  cookieZone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8
  },
  cookieWrap: {
    width: COOKIE_WIDTH,
    height: COOKIE_HEIGHT,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    shadowColor: "#4b2a13",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7
  },
  cookieHalfLayer: {
    position: "absolute",
    width: COOKIE_WIDTH,
    height: COOKIE_HEIGHT,
    borderRadius: 99
  },
  leftHalf: {
    left: 0
  },
  rightHalf: {
    right: 0
  },
  cookiePhoto: {
    position: "absolute",
    left: 0,
    top: 0,
    width: COOKIE_WIDTH,
    height: COOKIE_HEIGHT
  },
  fullCookiePhoto: {
    width: COOKIE_WIDTH,
    height: COOKIE_HEIGHT
  },
  hiddenHalf: {
    opacity: 0
  },
  crumb: {
    position: "absolute",
    left: 120,
    top: 74,
    backgroundColor: "#cc8b48"
  },
  paperWrap: {
    width: "100%",
    paddingHorizontal: 6,
    marginTop: 18
  },
  favoriteBtn: {
    marginTop: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#fff0dc",
    borderWidth: 1,
    borderColor: "#ebd2a0"
  },
  favoriteLabel: {
    color: theme.colors.accentDark,
    fontWeight: "600"
  },
  resetBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ffe4b8",
    borderWidth: 1,
    borderColor: "#e1b878"
  },
  resetLabel: {
    color: theme.colors.accentDark,
    fontWeight: "700"
  }
});
