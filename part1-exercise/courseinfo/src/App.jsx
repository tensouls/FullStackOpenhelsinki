import { useState } from "react";

const StatLine = ({ stat, text }) => (
  <tr>
    <td>{text}</td> <td>{stat}</td>
  </tr>
);

const Statitics = ({ stat, text }) => {
  return (
    <>
      <StatLine stat={stat[0].value} text={stat[0].text} />
      <StatLine stat={stat[1].value} text={stat[1].text} />
      <StatLine stat={stat[2].value} text={stat[2].text} />
      <StatLine
        stat={stat[2].value + stat[2].value + stat[1].value}
        text="all"
      />
      <StatLine
        stat={(
          (stat[0].value - stat[2].value) /
          (stat[0].value + stat[1].value + stat[2].value)
        ).toFixed(2)}
        text="average"
      />
      <StatLine
        stat={
          (
            (stat[0].value / (stat[0].value + stat[1].value + stat[2].value)) *
            100
          ).toFixed(2) + " %"
        }
        text="positive"
      />
    </>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  // save clicks of each button to its own state
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [vote, setVote] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);
  const handleAnecdoteClick = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));

  const handleVoteClick = () => {
    const updatedVote = [...vote];
    updatedVote[selected] += 1;
    setVote(updatedVote);
    console.log(vote, Math.max(...vote));
  };

  const data = [
    { value: good, text: "good" },
    { value: neutral, text: "neutral" },
    { value: bad, text: "bad" },
  ];

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} text="Good" />
      <Button onClick={handleNeutralClick} text="Neutral" />
      <Button onClick={handleBadClick} text="Bad" />
      <br />
      <h2>statitics</h2>
      <Statitics stat={data} text={data} />
      <br />
      <div>{anecdotes[selected]}</div>
      <div>has {vote[selected]} votes</div>
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleAnecdoteClick} text="next anecdote" />
      <h2>anecdote with most votes</h2>
      <p>
        {anecdotes[vote.indexOf(Math.max(...vote))]} has {Math.max(...vote)}
        votes
      </p>
    </div>
  );
};

export default App;
