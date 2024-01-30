const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not Important" : "make Important";

  return (
    <li key={note.id}>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
