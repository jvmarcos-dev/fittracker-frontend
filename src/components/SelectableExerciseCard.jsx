export default function SelectableExerciseCard({
  exercise,
  isSelected,
  currentData,
  onToogle,
  onChange,
}) {
  return (
    <div
      onClick={onToogle}
      style={{ cursor: "pointer" }}
      className={`exercise-card-selectable ${isSelected ? "selected" : ""}`}
    >
      <div className="exercise-card-header">
        <h4>{exercise.name}</h4>
        <input type="checkbox" checked={isSelected} onChange={() => {}}></input>
        <div>
          <h5>{exercise.muscle_group}</h5>
          {isSelected && (
            //este onClick sirve para que al pulsar sobre el campo no se deseleccione
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <input
                name="target_sets"
                placeholder="Sets"
                type="text"
                value={currentData?.target_sets ?? ""}
                onChange={(e) =>
                  onChange(exercise.id, "target_sets", e.target.value)
                }
              ></input>
              <input
                name="target_reps"
                placeholder="Reps"
                type="text"
                value={currentData?.target_reps ?? ""}
                onChange={(e) =>
                  onChange(exercise.id, "target_reps", e.target.value)
                }
              ></input>
            </div>
          )}
          <p>{exercise.description}</p>
        </div>
      </div>
    </div>
  );
}
