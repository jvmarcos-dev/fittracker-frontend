import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";

function ExerciseCard({ exercise, edit, onDelete, onEdit }) {
  return (
    <div>
      <h4>{exercise.name}</h4>
      <h5>{exercise.muscle_group}</h5>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {exercise.pivot && (
          <p>
            {exercise?.pivot.target_sets} series x {exercise?.pivot.target_reps}{" "}
            reps
          </p>
        )}
        {edit && (
          <div>
            <button
              type="button"
              onClick={onEdit}
              className="edit-button"
              aria-label="Editar rutina"
              title="Editar"
              style={{ width: "100%" }}
            >
              <EditIcon></EditIcon>
            </button>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
