import { useState, useEffect } from "react";
import axios, { AxiosHeaders } from "axios";

const Filter = ({ filter, handleFilterChange }) => (
  <>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </>
);

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    name: <input value={newName} onChange={handleNameChange} /> <br />
    number: <input value={newNumber} onChange={handleNumberChange} />
    <button type="submit">add</button>
  </form>
);

const Persons = ({ filtered, deletePerson }) => {
  console.log(filtered);
  return (
    <>
      {filtered.map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}
          <button
            onClick={() => deletePerson(person)}
            style={{ marginLeft: "10px", borderRadius: "5px" }}
          >
            delete
          </button>
        </div>
      ))}
    </>
  );
};

const Notification = ({ message }) => {
  if (message === null) return null;

  return (
    <div className={message.includes("AxiosError") ? "error" : "notification"}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((Response) => setPersons(Response.data));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newObj = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((p) => p.name === newObj.name);
    console.log(existingPerson);

    if (existingPerson) {
      if (
        confirm(
          `${existingPerson.name} already exists in address book. Replace old number with new one?`
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };

        axios
          .put(
            `http://localhost:3001/persons/${changedPerson.id}`,
            changedPerson
          )
          .then((response) =>
            setPersons(
              persons.map((p) =>
                p.id !== response.data.id ? p : response.data
              )
            )
          )
          .catch((error) =>
            setNotification(
              `Information of ${existingPerson.name} has already been deleted from the records`
            )
          );
        setNotification(`${existingPerson.name}'s number successfully changed`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
      setNewName("");
      setNewNumber("");
    } else {
      axios
        .post(`http://localhost:3001/persons`, newObj)
        .then((response) => setPersons(persons.concat(newObj)));
      setNewName("");
      setNewNumber("");
      setNotification(`${newObj.name} successfully added to records`);
      console.log(notification);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => setFilter(event.target.value);

  const filtered = persons.filter(
    (person) =>
      person.name && person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const deletePerson = (person) => {
    if (confirm(`Are you sure you want to delete ${person.name}`)) {
      axios
        .delete(`http://localhost:3001/persons/${person.id}`)
        .then(setPersons(persons.filter((p) => p.id !== person.id)))
        .catch((Error) => {
          setNotification(`Error: ${person.name} already deleted from records`);
        });
      setNotification(`${person.name} successfully deleted.`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons filtered={filtered} deletePerson={(id) => deletePerson(id)} />
    </div>
  );
};

export default App;
