import TextField from '@material-ui/core/TextField';
import {useState} from 'react'
import './Form.css'
import playerJSON from './players.json';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

const MAX_TOUCHDOWNS = 50;
const PLAYER_COUNT = 5;

const stopEnterOnKeyDown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    return false;
  }
}

const columns = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'position',
    headerName: 'Pos',
    width: 90,
  },
  {
    field: 'team',
    headerName: 'Team',
    width: 200,
  },
  {
    field: 'td',
    headerName: 'TDs',
    type: 'number',
    width: 90,
  },
];

const Form = () => {
  const [firstName, setFirstName] = useState('');
  const [firstError, setFirstError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastError, setLastError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerError, setPlayerError] = useState('');

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

    if (players.length !== PLAYER_COUNT) {
      setPlayerError(`You must select ${PLAYER_COUNT} players`);
      error = true;
    } else {
      let tds = 0;
      for (const playerId of players) {
        tds += playerJSON[playerId].td;
      }

      if (tds > MAX_TOUCHDOWNS) {
        setPlayerError(`Selected players had more than ${MAX_TOUCHDOWNS} TDs last season`);
        error = true;
      }
    }

    if (error) {
      return;
    }
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
            if(email) {
              setEmailError(false);
            }
          }}
          error={emailError}
          helperText={emailError ? 'Required' : ''}
        />
      </div>

      <div className="dataGrid">
        <DataGrid
        rows={playerJSON}
        columns={columns}
        rowsPerPage={1000}
        onSelectionModelChange={({selectionModel}) => {
          setPlayers(selectionModel)
          if (playerError) {
            setPlayerError('');
          }
        }}
        checkboxSelection
        hideFooterPagination
         hideFooter/>
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
