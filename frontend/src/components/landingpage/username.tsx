import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Username: React.FC<{ setUsername: (name: string) => void }> = ({
  setUsername,
}) => {
  const usernameInput = useRef<HTMLInputElement>(null);

  return (
    <div className="text-center">
      <div className="mb-4">Please enter your name to begin the game:</div>
      <div>
        <span className="pr-4">
          <input
            ref={usernameInput}
            type="text"
            name="username"
            className="border rounded-md border-gray-400 p-2"
          />
        </span>
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            if (usernameInput.current) {
              const val = usernameInput.current.value.trim();
              if (val !== "") {
                localStorage.setItem("username", val);
                localStorage.setItem("userid", uuidv4());
                setUsername(val);
              }
            }
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default Username;
