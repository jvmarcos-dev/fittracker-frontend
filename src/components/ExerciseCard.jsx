function ExerciseCard({ exercise }) {
  return (
    <div key={exercise.id}>
      <h4>{exercise.name}</h4>
      <h5>{exercise.muscle_group}</h5>
      <p>
        {exercise.pivot.target_sets} series x {exercise.pivot.target_reps} reps
      </p>
    </div>
  );
}

export default ExerciseCard;
