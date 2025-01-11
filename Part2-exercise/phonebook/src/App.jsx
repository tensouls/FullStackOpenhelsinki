import { useState, useEffect } from "react";
import contactService from "./services/contacts";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    contactService.getAll().then((iniContacts) => {
      setPersons(iniContacts);
    });
  }, []);

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      contactService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          setNotification(`${person.name} deleted succefully`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setNotification(
            `failed to delete as ${person.name} is has already been deleted`
          );
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  const addPerson = (e) => {
    e.preventDefault();
    const person = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((p) => p.name === person.name)) {
      let existingPerson = persons.find((p) => p.name === person.name);
      if (
        window.confirm(
          `${existingPerson.name} already in phonebook, replace old number with new number?`
        )
      ) {
        let changedNumber = { ...existingPerson, number: person.number };
        console.log(
          "here's the changed number",
          changedNumber,
          "and here's their id:",
          changedNumber.id
        );
        contactService
          .update(existingPerson.id, changedNumber)
          .then((updated) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? changedNumber : person
              )
            );
            setNotification(
              `${existingPerson.name}'s number successfully updated`
            );
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch((error) => {
            setNotification(
              `failed to create as ${existingPerson.name}. Here's the error: ${error}`
            );
          });
      }
      setNewName("");
    } else {
      contactService
        .create(person)
        .then((newPerson) => {
          setPersons([...persons, newPerson]);
          setNotification(`${newPerson.name} successfully added`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(`${error.response.data.error}`);
          setNotification(
            `failed to create as '${person.name}' ${error.response.data.error}`
          );
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filtered = persons.filter((p) =>
    p.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notifications message={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add New</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons filtered={filtered} handleDelete={handleDelete} />
    </div>
  );
};

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  );
};

const PersonForm = ({
  addPerson,
  handleNameChange,
  newName,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        {" "}
        name: <input value={newName} onChange={handleNameChange} />{" "}
      </div>
      <div>
        {" "}
        number: <input value={newNumber} onChange={handleNumberChange} />{" "}
      </div>
      <div>
        {" "}
        <button type="submit">add</button>{" "}
      </div>
    </form>
  );
};

const Persons = ({ filtered, handleDelete }) => {
  return (
    <ul style={{ listStyleType: "none" }}>
      {filtered.map((person) => (
        <li key={person.name}>
          {person.name}: {person.number}{" "}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notifications = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <div
      className={`${message.includes("failed") ? "warning" : "notifications"}`}
    >
      {message}
    </div>
  );
};

export default App;
