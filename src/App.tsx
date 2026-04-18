import { useState, useEffect } from "react";
import Setup from "./components/Setup";

import * as OTPAuth from "otpauth";
import DisplayCode from "./components/DisplayCode";

export default function App() {
  const [code, setCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("loggedIn"));

  const deleteLocalStorage = () => {
    localStorage.removeItem("loggedIn");
  }

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const secretToken = localStorage.getItem("secret");

    if (!secretToken) {
      throw new Error("secretToken is null");
    }

    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secretToken),
      digits: 6,
      period: 30,
    })

    const tick = () => {
      const currentCode = totp.generate();
      setCode(currentCode);
    }

    tick();
    const interval = setInterval((tick), 30000);
    return () => clearInterval(interval);
  }, [loggedIn])

  return (
    <>
      <div className="w-96 h-96 flex flex-col justify-center items-center">
        <h1 className="text-blue-500 text-2xl font-bold">ezAuth</h1>
        { !loggedIn ? <Setup onComplete={() => setLoggedIn(true)}/> : <DisplayCode code={code}/> }
      </div>
      <button onClick={deleteLocalStorage}>asdfadffda</button>
    </>
  )
}

