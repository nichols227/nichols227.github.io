import './App.css';
import Form from './Form.jsx';
import {useState} from 'react'

function Home() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        Pylon Pick 'Em
      </header>
      {submitted ? <div /> : <Form setSubmitted={setSubmitted} />}
    </div>
  );
}

export default Home;
