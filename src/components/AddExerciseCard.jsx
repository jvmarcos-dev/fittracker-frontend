import PlusIcon from "./icons/PlusIcon";

export default function AddExerciseCard({ onAdd }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="exercise-card add-exercise-card"
      aria-label="Añadir ejercicio a la rutina"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        minHeight: "150px",
        border: "2px dashed #444",
        borderRadius: "8px",
        background: "transparent",
        color: "#888",
        transition: "all 0.2s ease",
      }}
    >
      <PlusIcon size={32} />
      <span style={{ marginTop: "8px", fontSize: "0.9rem" }}>
        Añadir ejercicio
      </span>
    </button>
  );
}
