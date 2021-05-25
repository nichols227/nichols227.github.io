import TextField from '@material-ui/core/TextField';
import {useState, useMemo, useCallback} from 'react'
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

const getName = player => `${player.firstName} ${player.lastName}`;

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
  const [[playerSortColumn, playerSortDirection], setPlayerSort] = useState(['lastName', 'NONE']);
  const [[rookieSortColumn, rookieSortDirection], setRookieSort] = useState(['lastName', 'NONE']);

  const selectedTotal = useMemo(() => {
    let tds = 0;
    for (const playerId of Array.from(players)) {
      tds += playerJSON[playerId-1].td;
    }
    return tds;
  }, [players]);

  const sortedRookieRows = useMemo(() => {
    if (rookieSortDirection === 'NONE') return rookieJSON;

   let sortedRows = [...rookieJSON];

   switch (rookieSortColumn) {
     case 'firstName':
     case 'lastName':
     case 'position':
     case 'team':
       sortedRows = sortedRows.sort((a, b) => a[rookieSortColumn].localeCompare(b[rookieSortColumn]));
       break;
     case 'td':
       sortedRows = sortedRows.sort((a, b) => a[rookieSortColumn] - b[rookieSortColumn]);
       break;
   }

   return rookieSortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [rookieJSON, rookieSortColumn, rookieSortDirection]);

  const sortedPlayerRows = useMemo(() => {
    if (playerSortDirection === 'NONE') return playerJSON;

   let sortedRows = [...playerJSON];

   switch (playerSortColumn) {
     case 'firstName':
     case 'lastName':
     case 'position':
     case 'team':
       sortedRows = sortedRows.sort((a, b) => a[playerSortColumn].localeCompare(b[playerSortColumn]));
       break;
     case 'td':
       sortedRows = sortedRows.sort((a, b) => a[playerSortColumn] - b[playerSortColumn]);
       break;
   }

   return playerSortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
 }, [playerJSON, playerSortColumn, playerSortDirection]);

  const handlePlayerSort = useCallback((columnKey, direction) => {
    setPlayerSort([columnKey, direction]);
  }, []);

  const handleRookieSort = useCallback((columnKey, direction) => {
    setRookieSort([columnKey, direction]);
  }, []);

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

    const playerArray = Array.from(players);
    const rookieArray = Array.from(rookies);
    var urlencoded = new URLSearchParams();
    urlencoded.append("entry.101112653", firstName);
    urlencoded.append("entry.2028247391", lastName);
    urlencoded.append("entry.840246629", email);
    urlencoded.append("entry.922791203", teamName);
    urlencoded.append("entry.242737050", getName(playerJSON[playerArray[0] - 1]));
    urlencoded.append("entry.1346375085",getName(playerJSON[playerArray[1] - 1]));
    urlencoded.append("entry.890699852", getName(playerJSON[playerArray[2] - 1]));
    urlencoded.append("entry.1138431561", getName(playerJSON[playerArray[3] - 1]));
    urlencoded.append("entry.1311230266", getName(playerJSON[playerArray[4] - 1]));
    urlencoded.append("entry.1216679688", getName(playerJSON[playerArray[5] - 1]));
    urlencoded.append("entry.1816541943", getName(rookieJSON[rookieArray[0] - 144]));

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
      mode: 'no-cors',
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
        rows={sortedPlayerRows}
        columns={columns}
        rowKeyGetter={row => row.id}
        selectedRows={players}
        onSelectedRowsChange={players => {
          setPlayerError(false);
          setPlayers(players);
        }}
        className="playerDataGrid"
        sortColumn={playerSortColumn}
        sortDirection={playerSortDirection}
        onSort={handlePlayerSort}
         />
      </div>

      <div className="rookieText">
      <span><b>Rookies</b> (Pick 1)</span>
      </div>
      <div className="rookieGridWrapper">
        <DataGrid
        rows={sortedRookieRows}
        columns={rookieColumns}
        rowKeyGetter={row => row.id}
        selectedRows={rookies}
        onSelectedRowsChange={rookies => {
          setPlayerError(false);
          setRookies(rookies);
        }}
        className="rookieDataGrid"
        sortColumn={rookieSortColumn}
        sortDirection={rookieSortDirection}
        onSort={handleRookieSort}
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
