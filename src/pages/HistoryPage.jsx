import { useState } from "react";
import "../styles/history.css";
import historyMock from "../mocks/history.json";
export default function HistoryPage() {
  const [history, setHistory] = useState(historyMock);
  const [expandedLogIds, setExpandedLogIds] = useState([]);

  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    const formatted = new Intl.DateTimeFormat("es-ES", {
      weekday: "short", //sáb
      day: "numeric", //5
      month: "short", //sep
      hour: "2-digit", //20
      minute: "2-digit", //30
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0 min";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes} min`;
    }

    if (minutes === 0) {
      return `${hours} h`;
    }

    return `${hours} h ${minutes} min`;
  };

  const toogleExpand = (id) => {
    //busco entre los Ids que hay guardados en el array
    setExpandedLogIds((prevIds) =>
      //si el que paso por parametro ya se encuentra (ocultar)
      prevIds.includes(id)
        ? //dejo en el array los que son distintos (elimino el que paso por parametro)
          prevIds.filter((logId) => logId !== id)
        : //si no, lo añado al array
          [...prevIds, id],
    );
  };

  return (
    <>
      {history.length === 0 ? (
        <p>Aún no se han realizado ejercicios</p>
      ) : (
        history.map((routine) => {
          const isExpanded = expandedLogIds.includes(routine.id);
          return (
            <div className="history-card" key={routine.id}>
              <span className="history-date">
                {formatDate(routine.performed_at)}
              </span>
              <span className="history-title">{routine.name}</span>
              <span className="history-duration">
                {formatDuration(routine.duration_seconds)}
              </span>
              {isExpanded && (
                <div className="history-exercises">
                  {routine.exercises?.map((exercise) => {
                    return (
                      <div className="history-exercise-item" key={exercise.id}>
                        <span className="history-exercise-name">
                          {exercise.name}
                        </span>
                        <span className="history-exercise-muscle">
                          {exercise.muscle_group}
                        </span>

                        <div className="history-sets-table">
                          {exercise.sets?.map((set) => {
                            return (
                              <div
                                className="history-set-row"
                                key={set.set_number}
                              >
                                <span className="history-set-number">
                                  {set.set_number}
                                </span>
                                <span className="history-set-weight">
                                  {set.weight} kg
                                </span>
                                <span className="history-set-reps">
                                  {set.reps} reps
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={() => toogleExpand(routine.id)}
              >
                {isExpanded ? "Ocultar ejercicios" : "Mostrar ejercicios"}
              </button>
            </div>
          );
        })
      )}
    </>
  );
}
