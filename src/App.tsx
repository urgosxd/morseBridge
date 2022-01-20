import './App.css';


import React, { useState, useEffect, useCallback, useRef } from "react";
import { text } from 'stream/consumers';

const App = () => {
  //document.documentElement.lang = 'es'
  const [stt, setStt] = useState<string>('__');
  const [space, setSpace] = useState<boolean>(true);
  const [resMode, setResMode] = useState<boolean>(false)
  const [res, setRes] = useState<any | null | undefined>()
  const [funCurrent, setFunCurrent] = useState<(arg0: string) => void | null>(null)
  const [moveAndMax, setMoveAndMax] = useState<[number, number | undefined]>([1, undefined])
  const [finalText, setFinalText] = useState<string | null>(null)
  const refTime: React.MutableRefObject<NodeJS.Timer> = useRef()
  const timer = (): void => {
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
  const [a, seta] = useState<AudioContext>(new AudioContext())
  function k(w: number, x: number, y: number): void {
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
      switch (e.key) {
        case 'e':
          clearInterval(refTime.current)
          setStt((prev) => prev + ".");
          setSpace(false);
          k(20, 600, 100)
          refTime.current = setInterval(timer, 500);
          break;
        case 'u':
          clearInterval(refTime.current)
          setStt((prev) => prev + "-");
          setSpace(false);
          k(20, 700, 100)
          refTime.current = setInterval(timer, 500);
          break
        case '.':
          clearInterval(refTime.current)
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
          refTime.current = setInterval(timer, 500);
          break
        default:
          break;
      }
    },
    [setStt, setSpace]
  );
  useEffect(() => {
    // if (refTime.current) {
    //   clearInterval(timer)
    // }
    console.log("render");
    refTime.current = setInterval(timer, 700);
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const hablar = useCallback((e: KeyboardEvent) => {
    if (e.key === 'j') {
      if (finalText) {
        const uterrance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(finalText)
        uterrance.rate = 1
        uterrance.lang = 'es-419'
        speechSynthesis.speak(uterrance)
      }
      const latin: string = decodeMorse(stt)
      console.log(latin)
      const uterrance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(latin)
      uterrance.rate = 1
      uterrance.lang = 'es-419'
      speechSynthesis.speak(uterrance)
    }
    else if (e.key == 'a') {
      const latin: string = decodeMorse(stt)

      if (funCurrent) {
        if (resMode) {
          const args = latin.trim().split(' ')
          switch (args[0]) {
            case 'descripcion': {
              const text = res.knowledge_graph.description
              if (text == undefined) {
                return
              }
              setFinalText(text)
              const uterrance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text)
              uterrance.rate = 1
              uterrance.lang = 'es-419'
              speechSynthesis.speak(uterrance)
              setStt('')
              break;
            }
            case 'preguntas': {
              const text = res.related_questions
              if (text == undefined) {
                return
              }
              setFinalText(text[Number(args[1]) - 1][args[2]])
              const uterrance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text[Number(args[1]) - 1][args[2]])
              uterrance.rate = 1
              uterrance.lang = 'es-419'
              speechSynthesis.speak(uterrance)
              setStt('')
              break
            }
            case 'resultados': {
              const text = res.organic_results
              if (text == undefined) {
                return
              }
              setFinalText(text[Number(args[1]) - 1][args[2]])
              const uterrance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text[Number(args[1]) - 1][args[2]])
              uterrance.rate = 1
              uterrance.lang = 'es-419'
              speechSynthesis.speak(uterrance)
              setStt('')
              break
            }
            case 'exit':
              setResMode(false)
              funCurrent(null)
              break
            default:
              console.log('nada')
              break;
          }
          return
        }
        funCurrent(latin)
        setStt('')
        setResMode(true)
        return
      }
      switch (latin.trim()) {
        case 'fun search':
          setStt('')
          setFunCurrent(() => getGoogle)
          break;
        case 'fun query':
          setStt('')
          break
        default:
          break
      }
    }
  }, [stt, setResMode, setRes, funCurrent, setFunCurrent, res, setStt, setFinalText, finalText])
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

  async function getGoogle(query: string) {
    query = query.trim().replaceAll(' ', '+')
    console.log(query)
    const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${query}&location=Peru&google_domain=google.com.pe&gl=pe&hl=es&num=3&api_key=956366187f9ce0de0ab8fec9a2103250819db90578aac9935c13f85a9abe92fb`)
    response.json().then(e => setRes(e))

  }
  return <div>{stt}<div>{resMode ? 'true' : 'false'}</div></div>;
};

export default App;
