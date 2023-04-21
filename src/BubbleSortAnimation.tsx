import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import useForceUpdate from "./useForceUpdate";

const { width } = Dimensions.get("window");

export const BubbleSortAnimation = () => {
  const [array, setArray] = useState<Array<number>>([]);
  const forPostion = useRef(new Animated.Value(0));
  const backPostion = useRef(new Animated.Value(0));
  const isLast = useRef(false);
  const active = useRef(0);

  const isComleted = useRef(true);
  const initArray = useRef<Array<number>>([]);

  useEffect(() => {
    getNewArray();
  }, []);

  const update = useForceUpdate();

  const animate = (j: number) => {
    Animated.parallel([
      Animated.spring(forPostion.current, {
        toValue: 64,
        speed: 3,
        useNativeDriver: true,
      }),
      Animated.spring(backPostion.current, {
        toValue: -64,
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
          style={[styles.box, translateXStyle]}
        >
          <Text style={styles.text}>{value}</Text>
        </Animated.View>
      );
    });
  };

  async function start() {
    isLast.current = false;
    isComleted.current = false;
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

  function getNewArray() {
    const newarray = [];
    for (let i = 0; i < 6; i++) {
      const randomNum = Math.floor(Math.random() * 100) + 1;
      newarray.push(randomNum);
    }
    initArray.current = newarray;
    setArray(newarray);
  }

  function Reset() {
    setArray(initArray.current);
    update();
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>{list()}</View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={async () => {
            await start();
            isComleted.current = true;
            update();
          }}
          disabled={!isComleted.current}
          style={[
            styles.Btn,
            { backgroundColor: !isComleted.current ? "#fcd9dd" : "#ff5466" },
          ]}
        >
          <Text style={styles.text}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Reset();
          }}
          disabled={!isComleted.current}
          style={[
            styles.Btn,
            { backgroundColor: !isComleted.current ? "#fcd9dd" : "#ff5466" },
          ]}
        >
          <Text style={styles.text}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            getNewArray();
          }}
          disabled={!isComleted.current}
          style={[
            styles.Btn,
            { backgroundColor: !isComleted.current ? "#fcd9dd" : "#ff5466" },
          ]}
        >
          <Text style={styles.text}>New Array</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 30,
    marginLeft: 4,
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
  Btn: {
    marginTop: 30,
    marginHorizontal: 10,
    backgroundColor: "#ff5466",
    padding: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
  },
});
