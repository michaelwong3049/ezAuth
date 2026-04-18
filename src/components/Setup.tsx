import { useState } from "react";

type SetupProps = {
  onComplete: () => void;
}

export default function Setup({ onComplete }: SetupProps) {
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [missingSecret, setMissingSecret] = useState(false);
  const [missmatchPasswords, setMissmatchPasswords] = useState(false);

  const createToken = () => {
    if (secret == "") {
      setMissingSecret(true);
      return;
    }

    if (password != confirmPassword || (password == "" || confirmPassword == "")) {
      setMissmatchPasswords(true);
      return;
    }

    localStorage.setItem("loggedIn", "true")
    localStorage.setItem("secret", secret);
    onComplete();
  }

  return (
    <div className="w-80 h-96 p-4 bg-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl text-blue-700 font-bold">CUNY TOTP</h1>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
        <label>TOTP Secret</label>
        <input
          className="border-2 border-black rounded"
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <label>Password</label>
        <input
          className="border-2 border-black rounded"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <input
          className="border-2 border-black rounded"
          type="text"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {missingSecret ? <h2 className="text-red-500">Please input a secret key</h2> : <div></div>}
      {missmatchPasswords ? <h2 className="text-red-500">Passwords do not match</h2> : <div></div>}

      <button onClick={createToken}>Create Token</button>
    </div>
  )
}

