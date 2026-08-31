import { useEffect, useState } from "react";
import "../styles/workout.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { finishRoutine, startRoutine } from "../services/routineService";
import TrashIcon from "../components/icons/TrashIcon";
export default function WorkoutPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [workout, setWorkout] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      setError(null);

      try {
        const workoutData = await startRoutine(id);

        const preparedWorkout = {
          ...workoutData,
          exercises: workoutData.exercises.map((exercise) => {
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
                  previous: prev
                    ? `${Number(prev.weight)} x ${prev.reps}`
                    : "-",
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
        };

        setWorkout(preparedWorkout);
      } catch (err) {
        setError(err.message || "Error al cargar la rutina");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkout();
    }
  }, [id]);

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

  const handleFinishWorkout = async () => {
    const formattedExercises = workout.exercises
      .map((exercise) => ({
        exercise_id: exercise.id,
        //solo guardo las series que estén completadas
        sets: exercise.sets
          .filter((set) => set.completed && Number(set.reps) > 0)
          .map((set) => ({
            set_number: set.set_number,
            weight: Number(set.weight) || 0,
            reps: Number(set.reps),
          })),
        //descarto los ejercicios sin series hechas o con 0 reps
      }))
      .filter((exercise) => exercise.sets.length > 0);

    const finishedPayload = {
      routine_id: workout.routine_id,
      duration_seconds: seconds,
      performed_at: new Date().toISOString(),
      exercises: formattedExercises,
    };

    try {
      setLoading(true);
      const data = await finishRoutine(id, finishedPayload);

      //si ha ido todo bien vuelve a la pantalla de rutinas
      navigate("/routines");
    } catch (err) {
      setError(err.message || "Error al guardar el entrenamiento");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExercise = (exerciseId) => {
    //TODO: Para confirmar que el usuario quiere eliminar, primero pulsar sobre 3 puntos
    //y despues que aparezca la papelera
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter(
        (exercise) => exercise.id !== exerciseId,
      ),
    }));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!workout) {
    return null;
  }

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
            <p style={{ margin: "0", color: "#0a84ff" }}>{workout.name}</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <button onClick={handleFinishWorkout}>Finalizar</button>
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
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="delete-button"
                      style={{ backgroundColor: "#3f1414", color: "#ef4444" }}
                      aria-label={`Eliminar ejercicio`}
                      title="Eliminar"
                    >
                      <TrashIcon></TrashIcon>
                    </button>
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
