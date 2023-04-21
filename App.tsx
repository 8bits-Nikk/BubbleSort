import { useRef, useState } from "react";
import { Animated, Button, StyleSheet, Text, View } from "react-native";
import useForceUpdate from "./useForceUpdate";

export default function App() {
  const [array, setArray] = useState([30, 20, 10, 0]);
  const forPostion = useRef(new Animated.Value(0));
  const backPostion = useRef(new Animated.Value(0));
  const isLast = useRef(false);
  const active = useRef(0);

  const update = useForceUpdate();

  const animate = (j: number) => {
    Animated.parallel([
      Animated.spring(forPostion.current, {
        toValue: 60,
        speed: 3,
        useNativeDriver: true,
      }),
      Animated.spring(backPostion.current, {
        toValue: -60,
        speed: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newA = swap(array, j, j + 1);
      setArray(newA);
      forPostion.current = new Animated.Value(0);
      backPostion.current = new Animated.Value(0);
    });
  };

  const list = () => {
    return array.map((value, index) => {
      let translateXStyle = {};
      if (
        !isLast.current &&
        active.current === index &&
        active.current < array.length - 1
      ) {
        translateXStyle = {
          backgroundColor: "#ffaa11",
          transform: [
            {
              translateX: forPostion.current,
            },
          ],
        };
      } else if (
        !isLast.current &&
        active.current + 1 === index &&
        active.current < array.length - 1
      ) {
        translateXStyle = {
          backgroundColor: "#aacc33",
          transform: [
            {
              translateX: backPostion.current,
            },
          ],
        };
      }
      return (
        <Animated.View
          key={index.toString() + "value"}
          style={[style.box, translateXStyle]}
        >
          <Text style={style.text}>{value}</Text>
        </Animated.View>
      );
    });
  };

  async function start() {
    isLast.current = false;
    for (let i = 0; i < array.length - 1; i++) {
      active.current = 0;
      update();
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          animate(j);
        }
        await sleep(100);
        if (i < array.length - 2) {
          active.current = j + 1;
        } else {
          isLast.current = true;
          active.current = j;
        }
        await sleep(1500);
        update();
      }
    }
  }

  function swap(_array: number[], xp: number, yp: number) {
    [_array[xp], _array[yp]] = [_array[yp], _array[xp]];
    return _array;
  }

  function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  return (
    <View style={style.container}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>{list()}</View>
      <Button
        title="Go"
        onPress={() => {
          start();
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffaabb",
    borderWidth: 1,
    borderColor: "yellow",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
