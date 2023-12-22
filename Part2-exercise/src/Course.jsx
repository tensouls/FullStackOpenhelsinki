const Head = ({ name }) => <h3>{name}</h3>;

const Part = ({ parts }) => {
  console.log(parts[0].exercises);
  const total = parts
    .map((part) => part.exercises)
    .reduce((sum, exercises) => sum + exercises, 0);
  console.log(total);
  return (
    <>
      <ul>
        {parts.map((part) => (
          <li key={part.id}>{part.name + ": " + part.exercises}</li>
        ))}
      </ul>
      <h4> total of {total} exercises</h4>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      <Part parts={parts} />
    </>
  );
};

const Course = ({ course }) => {
  console.log(course[0].parts);
  return (
    <>
      <h1>Web development curriculum</h1>
      <Head name={course[0].name} />
      <Content parts={course[0].parts} />
      <Head name={course[1].name} />
      <Content parts={course[1].parts} />
    </>
  );
};

export default Course;
