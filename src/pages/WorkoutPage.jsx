import { useEffect, useState } from "react";
import mockWorkout from "../mocks/activeWorkout.json";
import "../styles/workout.css";
export default function WorkoutPage() {
  //en el estado guardo lo que recibo del fetch y obtengo la cantidad de series a pintar
  //que es la cantidad que indica en target_sets
  const [workout, setWorkout] = useState(() => ({
    ...mockWorkout,
    exercises: mockWorkout.exercises.map((exercise) => {
      //creo un array con la longitud de las series totales
      const generatedSets = Array.from(
        { length: exercise.target_sets },
        (_, index) => {
          const prev = exercise.previous_sets[index];

          //en el array para cada posicion meto sus valores correspondientes
          return {
            set_number: index + 1,
            weight: prev ? prev.weight : "",
            reps: prev ? prev.reps : "",
            previous: prev ? `${Number(prev.weight)} x ${prev.reps}` : "-",
            completed: false,
          };
        },
      );

      //devuelvo el ejercicio añadiendole en sets el array
      return {
        ...exercise,
        sets: generatedSets,
      };
    }),
  }));
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

  const handleAddSet = (exerciseId) => {
    const exercise = workout.exercises.find((item) => item.id === exerciseId);
    const sets = exercise.sets.length + 1;
    let prevWeight = "";
    let prevReps = "";
    if (exercise.previous_sets[sets - 1]) {
      prevWeight = exercise.previous_sets[sets - 1].weight;
      prevReps = exercise.previous_sets[sets - 1].reps;
    }

    const newSet = {
      set_number: sets,
      weight: prevWeight,
      reps: prevReps,
      previous: prevWeight !== "" ? `${Number(prevWeight)} x ${prevReps}` : "-",
      completed: false,
    };

    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      //recorro los ejercicios en busca del pulsado
      exercises: prevWorkout.exercises.map((item) => {
        if (item.id === exerciseId) {
          //si es el pulsado, le añado la nueva serie
          return {
            ...item,
            sets: [...item.sets, newSet],
          };
        }

        //los demas ejercicios se devuelven como estaban
        return item;
      }),
    }));
  };

  const handleRemoveSet = (exerciseId) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.map((prevExercise) => {
        if (prevExercise.id === exerciseId) {
          return {
            ...prevExercise,
            sets:
              prevExercise.sets.length > 1
                ? prevExercise.sets.slice(0, -1)
                : prevExercise.sets,
          };
        }

        return prevExercise;
      }),
    }));
  };

  const handleSetChange = (exerciseId, setNumber, field, value) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.map((prevExercise) => {
        if (prevExercise.id === exerciseId) {
          return {
            ...prevExercise,
            sets: prevExercise.sets.map((prevSet) => {
              if (prevSet.set_number === setNumber) {
                return {
                  ...prevSet,
                  //para propiedades dinamicas hay que ponerlo entre corchetes
                  [field]: value,
                };
              }

              return prevSet;
            }),
          };
        }

        return prevExercise;
      }),
    }));
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
          {workout.exercises.map((exercise) => {
            return (
              <div className="exercise" key={exercise.id}>
                <div className="exercise-header">
                  <h3>{exercise.name}</h3>
                  <span className="exercise-target">
                    {exercise.muscle_group} · {exercise.target_sets} x{" "}
                    {exercise.target_reps || "8-12"}
                  </span>
                </div>

                <div className="exercise-table-header">
                  <span>SERIE</span>
                  <span>ANTERIOR</span>
                  <span>KG</span>
                  <span>REPS</span>
                  <span>✓</span>
                </div>

                {exercise.sets.map((set) => (
                  <div className="exercise-details" key={set.set_number}>
                    <div className="serie-number">
                      <p>{set.set_number}</p>
                    </div>

                    <div className="past-set">
                      <p>{set.previous}</p>
                    </div>

                    <div className="set-kg">
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={set.weight !== "" ? Number(set.weight) : ""}
                        onChange={(e) =>
                          handleSetChange(
                            exercise.id,
                            set.set_number,
                            "weight",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="set-reps">
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(
                            exercise.id,
                            set.set_number,
                            "reps",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <input
                      type="checkbox"
                      checked={set.completed}
                      onChange={(e) =>
                        handleSetChange(
                          exercise.id,
                          set.set_number,
                          "completed",
                          e.target.checked,
                        )
                      }
                    />
                  </div>
                ))}

                <button type="button" onClick={() => handleAddSet(exercise.id)}>
                  + Agregar serie
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveSet(exercise.id)}
                >
                  - Eliminar última serie
                </button>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
