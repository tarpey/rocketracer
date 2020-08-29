import React, { useState } from "react";
import firebase from "../Config/Firebase";
import { Link } from "react-router-dom";
import Button from "../Components/Button";

export default ({ history }) => {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [joinForm, setJoinForm] = useState(false);

  const db = firebase.firestore();
  const newRace = () => {
    // Generate a six digit number
    let code = Math.floor(1000 + Math.random() * 9000).toString();
    // Check code is free
    db.collection("races")
      .doc(code)
      .get()
      .then((race) => {
        if (!race.exists) {
          db.collection("races")
            .doc(code)
            .set({
              created: new Date(),
              locked: false,
              racers: [],
              ranking: [],
              started: false,
            })
            .then((race) => {
              // Redirect to race URL
              history.push(`/${code}`);
            })
            .catch(function (error) {
              console.error("Race not created!", error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const joinRace = () => {
    let code = prompt("JOIN CODE", "");
    if (code !== null && code !== "") {
      db.collection("races")
        .doc(code)
        .onSnapshot((race) => {
          if (race.exists) {
            if (race.data().locked) {
              setErrorMessage("Race Locked");
              setTimeout(() => {
                setErrorMessage();
              }, 3000);
            }
            // Valid - Join
            setErrorMessage();
            setSuccessMessage("Joining Race...");
            setTimeout(() => {
              history.push(`/${code}`);
            }, 3000);
          } else {
            setErrorMessage("Invalid Code");
            setTimeout(() => {
              setErrorMessage();
            }, 3000);
          }
        });
    }
  };

  return (
    <div className="menu">
      <h1>
        <Link to="/">RocketRacer</Link>
      </h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {!joinForm ? (
        <>
          <Button text="New Race" onClick={newRace} />
          <button className="button" onClick={() => setJoinForm(!joinForm)}>
            Join Race
          </button>
        </>
      ) : (
        <>
          <div className="code">
            <label>Enter Join Code</label>
            <div className="inputs">
              <input type="text" maxlength="4" />
            </div>
          </div>
          <div className="two-buttons">
            <button className="button" onClick={joinRace}>
              Join
            </button>
            <button className="button" onClick={() => setJoinForm(!joinForm)}>
              Cancel
            </button>
          </div>
        </>
      )}

      <p>
        Built with <a href="https://reactjs.org">React</a> and{" "}
        <a href="https://firebase.google.com">Firebase</a> by{" "}
        <a href="https://jamestarpey.com">James Tarpey</a>
      </p>
    </div>
  );
};
