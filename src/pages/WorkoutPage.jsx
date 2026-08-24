import { useEffect, useState } from "react";
import mockWorkout from "../mocks/activeWorkout.json";
import "../styles/workout.css";
export default function WorkoutPage() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${minutes}:${secs}`;
    }

    return `${minutes}:${secs}`;
  };

  return (
    <>
      <div className="workout">
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ margin: "0" }}>Duración</p>
            <p style={{ margin: "0", color: "#0a84ff" }}>
              {formatTime(seconds)}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ margin: "0" }}>Rutina</p>
            <p style={{ margin: "0", color: "#0a84ff" }}>{mockWorkout.name}</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <button>Finalizar</button>
          </div>
        </header>

        <section className="exercises">
          {mockWorkout.exercises.map((exercise) => {
            return (
              <div className="exercise">
                <h3>{exercise.name}</h3>

                {exercise.previous_sets.map((set) => {
                  return (
                    <div className="exercise-details">
                      <div className="serie-number">
                        <p>{set.set_number}</p>
                      </div>

                      <div className="past-set">
                        <p>
                          {Number(set.weight)} x {set.reps}
                        </p>
                      </div>

                      <div className="set-kg">
                        <input type="text" value={Number(set.weight)}></input>
                      </div>

                      <div className="set-reps">
                        <input type="text" value={set.reps}></input>
                      </div>

                      <input type="checkbox"></input>
                    </div>
                  );
                })}

                <button> + Agregar serie</button>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
