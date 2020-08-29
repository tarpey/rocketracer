import React, { useState, useEffect } from "react";
import firebase from "../Config/Firebase";
import { useParams } from "react-router-dom";
import Rocket from "../Components/Rocket";

export default ({ history }) => {
  const db = firebase.firestore();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [racers, setRacers] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [started, setStarted] = useState();

  // Init
  useEffect(() => {
    // Fetch data from DB
    let unsubscribe = db
      .collection("races")
      .doc(id)
      .onSnapshot((race) => {
        if (race.exists) {
          if (race.data().locked) {
            // Room is locked - Redirect
            history.push(`/`);
          }
          // Fetch race details
          if (race.data().racers) {
            setRacers(race.data().racers);
            setRanking(race.data().ranking);
            setStarted(race.data().started);
          }
          setLoading(false);
        } else {
          // Invalid ID - Redirect
          history.push(`/`);
        }
      });
    return () => unsubscribe;
  }, [db, id, history]);

  const resetRace = () => {
    setStarted(false);
    setRanking([]);
    // Reset starting positions
    racers.forEach(function (racer, index) {
      racer.position = 10;
      racer.finished = false;
      racer.moving = false;
      racer.rank = false;
    });
    // Update the DB
    db.collection("races").doc(id).update({
      started: false,
      racers: racers,
      ranking: [],
    });
  };

  const startRace = () => {
    const trackLength = document.getElementById("track").offsetWidth;
    const objects = document.querySelectorAll(".racer");
    setStarted(true);

    // Loop
    racers.forEach(function (racer, index) {
      racer.moving = true;
      let timer = setInterval(() => {
        // Has the racer finished?
        racer.finished = trackLength - objects[index].offsetLeft === 70;
        if (racer.finished) {
          // Racer has finished
          racer.moving = false;
          // Update ranking
          ranking.push(racer.name);
          racer.rank = ranking.length;
          if (racers.length === ranking.length) {
            setStarted(false);
          }
          // Stop racer from updating
          clearInterval(timer);
        } else {
          // Move rocket!
          let remaining = trackLength - objects[index].offsetLeft;
          if (remaining < 140) {
            racer.position = trackLength - 70;
          } else {
            racer.position = racer.position + Math.round(Math.random() * 60);
          }
        }
        // Update the DB
        db.collection("races").doc(id).update({
          started: true,
          racers: racers,
          ranking: ranking,
        });
      }, 500);
    });
  };

  const addRacer = () => {
    let name = prompt("Rocket Name", "");
    if (name !== null && name !== "") {
      racers.push({
        name,
        position: 10,
        finished: false,
        moving: false,
        colors: ["#FF637B", "#FF637B", "#FF637B", "#E63950"],
        rank: false,
      });
      // Update the DB
      db.collection("races").doc(id).update({
        racers: racers,
      });
    }
  };

  const renameRacer = (index, name) => {
    let newName = prompt("RACER NAME", name);
    if (newName !== name && newName !== null && newName !== "") {
      racers[index].name = newName;
      // Update the DB
      db.collection("races").doc(id).update({
        racers: racers,
      });
    }
  };

  const removeRacer = (index) => {
    racers.splice(index, 1);
    // Update the DB
    db.collection("races").doc(id).update({
      racers: racers,
    });
  };

  return (
    !loading && (
      <>
        <main>
          <div className="container">
            <div className="row">
              <div className="col">
                {racers.length && racers.length === ranking.length ? (
                  <button className="button" onClick={resetRace}>
                    Reset Race
                  </button>
                ) : (
                  <button
                    className="button"
                    disabled={started || !racers.length}
                    onClick={startRace}
                  >
                    Start Race
                  </button>
                )}
              </div>
              <div className="col">
                <button
                  className="button"
                  onClick={addRacer}
                  disabled={racers.length >= 5 || started}
                >
                  Add Racer
                </button>
              </div>
            </div>

            {racers.length > 0 && (
              <div id="track">
                <div className="start"></div>
                <div className="finish"></div>
                <div className="racers">
                  {racers.map((racer, index) => (
                    <div key={index} className="lane">
                      {racer.rank && (
                        <div className={`rank rank-${racer.rank}`}>
                          {racer.rank}
                        </div>
                      )}
                      <div className="racer" style={{ left: racer.position }}>
                        {!started && (
                          <div className="options">
                            <button
                              onClick={() => renameRacer(index, racer.name)}
                            >
                              Rename
                            </button>
                            <button onClick={() => removeRacer(index)}>
                              Remove
                            </button>
                          </div>
                        )}
                        <Rocket
                          primary={racer.colours ? racer.colours[0] : "#FAECD8"}
                          secondary={
                            racer.colours ? racer.colours[1] : "#FF637B"
                          }
                        />
                        {racer.moving && (
                          <div className="flames">
                            <div className="red flame"></div>
                            <div className="orange flame"></div>
                            <div className="yellow flame"></div>
                            <div className="white flame"></div>
                          </div>
                        )}
                        <span className="name">{racer.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </>
    )
  );
};
