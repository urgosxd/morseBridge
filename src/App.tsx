import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect, useCallback, useRef } from "react";

const App = () => {
  const [stt, setStt] = useState('__');
  const [space, setSpace] = useState(true);
  const refTime: any = useRef()
  const timer: any = () => {
    setStt((prev) => {
      if (prev) {
        if (prev.at(-1) == "_" && prev.at(-2) == "_") {
          setSpace(true)
          return prev;
        } else {
          setSpace(true);
          return prev + "_";
        }

      } else {
        return '_'
      }

    });
  };
  const [a, seta] = useState(new AudioContext())
  function k(w, x, y) {
    let v = a.createOscillator()
    let u = a.createGain()
    v.connect(u)
    v.frequency.value = x
    v.type = "sine"
    u.connect(a.destination)
    u.gain.value = w * 0.01
    v.start(a.currentTime)
    v.stop(a.currentTime + y * 0.001)
  }
  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "e") {
        refTime.current = clearInterval(timer)
        setStt((prev) => prev + ".");
        setSpace(false);
        k(20, 600, 100)
      } else if (e.key === "u") {
        refTime.current = clearInterval(timer)
        setStt((prev) => prev + "-");
        setSpace(false);
        k(20, 700, 100)
      } else if (e.key === ".") {
        refTime.current = clearInterval(timer)

        setStt((prev) => {
          let val = 0
          for (let i = 1; i < 3; i++) {
            if (prev.at(-i) == '_') {
              val++
            } else {
              break
            }
          }
          let spaces = prev.substring(0, prev.length - val)
          return prev.substring(0, spaces.lastIndexOf('_') + 1)
        })
      }
    },
    [setStt, setSpace]
  );
  useEffect(() => {
    console.log("render");
    refTime.current = setInterval(timer, 700);
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const hablar = useCallback((e) => {
    if (e.key === 'j') {
      const latin = decodeMorse(stt)
      console.log(latin)
      const uterrance = new SpeechSynthesisUtterance(latin)
      uterrance.rate = 1
      uterrance.lang = 'es-419'
      speechSynthesis.speak(uterrance)
    }
  }, [stt])
  useEffect(() => {
    document.addEventListener('keydown', hablar)
    return () => document.removeEventListener('keydown', hablar)
  }, [hablar])
  function decodeMorse(morseCode: string | undefined) {
    let ref = {
      ".-": "a",
      "-...": "b",
      "-.-.": "c",
      "-..": "d",
      ".": "e",
      "..-.": "f",
      "--.": "g",
      "....": "h",
      "..": "i",
      ".---": "j",
      "-.-": "k",
      ".-..": "l",
      "--": "m",
      "-.": "n",
      "---": "o",
      ".--.": "p",
      "--.-": "q",
      ".-.": "r",
      "...": "s",
      "-": "t",
      "..-": "u",
      "...-": "v",
      ".--": "w",
      "-..-": "x",
      "-.--": "y",
      "--..": "z",
      ".----": "1",
      "..---": "2",
      "...--": "3",
      "....-": "4",
      ".....": "5",
      "-....": "6",
      "--...": "7",
      "---..": "8",
      "----.": "9",
      "-----": "0"
    };

    return morseCode!!
      .split("__")
      .map((a) =>
        a
          .split("_")
          .map((b) => ref[b])
          .join("")
      )
      .join(" ");
  }


  return <div>{stt}</div>;
};

export default App;
