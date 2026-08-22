import TrashIcon from "./icons/TrashIcon";

function ExerciseCard({ exercise, edit, onDelete, onChange }) {
  return (
    <div>
      <h4>{exercise.name}</h4>
      <h5>{exercise.muscle_group}</h5>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {exercise.pivot && (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {!edit ? (
              exercise?.pivot.target_sets
            ) : (
              <input
                type="number"
                style={{ width: "40px", textAlign: "center" }}
                value={exercise?.pivot.target_sets ?? ""}
                onChange={(e) =>
                  onChange(exercise.id, "target_sets", e.target.value)
                }
              ></input>
            )}{" "}
            series x{" "}
            {!edit ? (
              exercise?.pivot.target_reps
            ) : (
              <input
                type="text"
                style={{ width: "40px", textAlign: "center" }}
                value={exercise?.pivot.target_reps ?? ""}
                onChange={(e) =>
                  onChange(exercise.id, "target_reps", e.target.value)
                }
              ></input>
            )}{" "}
            reps
          </p>
        )}
        {edit && (
          <button
            type="button"
            onClick={onDelete}
            className="delete-button"
            aria-label={`Eliminar ${exercise.name}`}
            title="Eliminar"
            style={{ width: "100%" }}
          >
            <TrashIcon></TrashIcon>
          </button>
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
