import TextField from '@material-ui/core/TextField';
import {useState, useMemo} from 'react'
import './Form.css'
import playerJSON from './players.json';
import rookieJSON from './rookies.json';
import DataGrid,  { SelectColumn} from 'react-data-grid';
import Button from '@material-ui/core/Button';

const MAX_TOUCHDOWNS = 48;
const PLAYER_COUNT = 6;

const stopEnterOnKeyDown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    return false;
  }
}

const columns = [
  SelectColumn,
  { key: 'firstName', name: 'First name', sortable: true },
  { key: 'lastName', name: 'Last name', sortable: true },
  {
    key: 'position',
    name: 'Pos',
    sortable: true,
  },
  {
    key: 'team',
    name: 'Team',
    sortable: true
  },
  {
    key: 'td',
    name: 'TDs',
    sortable: true
  },
];

const rookieColumns = [
  SelectColumn,
  { key: 'firstName', name: 'First name', sortable: true },
  { key: 'lastName', name: 'Last name', sortable: true },
  {
    key: 'position',
    name: 'Pos',
    sortable: true
  },
  {
    key: 'team',
    name: 'Team',
    sortable: true
  },
]

const Form = (props) => {
  const [firstName, setFirstName] = useState('');
  const [firstError, setFirstError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastError, setLastError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamNameError, setTeamNameError] = useState(false);
  const [players, setPlayers] = useState(new Set());
  const [rookies, setRookies] = useState(new Set());
  const [playerError, setPlayerError] = useState('');

  const selectedTotal = useMemo(() => {
    let tds = 0;
    for (const playerId of Array.from(players)) {
      tds += playerJSON[playerId-1].td;
    }
    return tds;
  }, [players])

  const onFormSubmit = () => {
    let error = false;
    if (!firstName) {
      setFirstError(true);
      error = true;
    }
    if (!lastName) {
      setLastError(true);
      error = true;
    }
    if (!email) {
      setEmailError(true);
      error = true;
    }

    if (!teamName) {
      setTeamNameError(true);
      error = true;
    }

    if (players.size !== PLAYER_COUNT) {
      setPlayerError(`You must select ${PLAYER_COUNT} players (you selected ${players.size})`);
      error = true;
    } else if (rookies.size !== 1) {
      setPlayerError(`You must select 1 rookie (you selected ${rookies.size})`);
      error = true;
    } else {
      if (selectedTotal > MAX_TOUCHDOWNS) {
        setPlayerError(`Selected returning players had more than ${MAX_TOUCHDOWNS} TDs last season (your total is ${selectedTotal})`);
        error = true;
      }
    }

    if (error) {
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "S=spreadsheet_forms=iOix59PVJQrBql1NCvI-UO1ysUrZHuFG4jrJTmF2l4k; NID=216=m6o3-RIDhOz0TNdnW2M0wHsysX01AGQ49IlUt-0aXWfvOryMb1GxcUs-RRivHc611Uu78d2NmvUqQVpNoYcmdVGnHLj1tMZ0-U3olCPwq7dti-mTLbDTRc2cD0O8Mm8Ff0teUAXmDgiyIz_Jb-q2QfKf62Pufs4B32h2NFVnWLk");

    var urlencoded = new URLSearchParams();
    urlencoded.append("entry.101112653", firstName);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
      mode: 'cors',
      credentials: 'include'
    };

    fetch("https://docs.google.com/forms/d/e/1FAIpQLScObPyuHrMe66iKhHbEeQZ11Sr3moTk5Y69wLBppjB9-hyTqA/formResponse", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        props.setSubmitted(true);
      })
      .catch(error => console.log('error', error));
  }

  return (
    <form className='appForm' onKeyDown={stopEnterOnKeyDown}>
      <div className="formFields">
        <TextField
          required
          className="formField"
          label='First Name'
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            if (firstError) {
              setFirstError(false);
            }
          }}
          error={firstError}
          helperText={firstError ? 'Required' : ''}
        />
        <TextField
          required
          className="formField"
          label='Last Name'
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            if(lastError) {
              setLastError(false);
            }
          }}
          error={lastError}
          helperText={lastError ? 'Required' : ''}
         />
        <TextField
          required
          className="formField"
          label='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if(emailError) {
              setEmailError(false);
            }
          }}
          error={emailError}
          helperText={emailError ? 'Required' : ''}
        />
        <TextField
          required
          className="formField"
          label='Team Name'
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
            if(teamNameError) {
              setTeamNameError(false);
            }
          }}
          error={teamNameError}
          helperText={teamNameError ? 'Required' : ''}
        />
      </div>

      <div className="playerText">
        <span><b>Returning Players</b> (Pick {PLAYER_COUNT}, Max {MAX_TOUCHDOWNS} combined)</span>
        <span><b>Selected TD Total:</b> {selectedTotal}</span>
      </div>
      <div className="dataGridWrapper">
        <DataGrid
        rows={playerJSON}
        columns={columns}
        rowKeyGetter={row => row.id}
        selectedRows={players}
        onSelectedRowsChange={players => {
          setPlayerError(false);
          setPlayers(players);
        }}
        className="playerDataGrid"
         />
      </div>

      <div className="rookieText">
      <span><b>Rookies</b> (Pick 1)</span>
      </div>
      <div className="rookieGridWrapper">
        <DataGrid
        rows={rookieJSON}
        columns={rookieColumns}
        rowKeyGetter={row => row.id}
        selectedRows={rookies}
        onSelectedRowsChange={rookies => {
          setPlayerError(false);
          setRookies(rookies);
        }}
        className="rookieDataGrid"
        />
      </div>

      <div className="formFooter">
        <div className="footerError">{playerError}</div>
        <Button className='submitButton' variant="contained" color="primary" onClick={onFormSubmit}>
          Submit
        </Button>
      </div>
    </form>
  )
}

export default Form;
