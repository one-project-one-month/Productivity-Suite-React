import { useLocation } from 'react-router';

const NoteUpdate = () => {
  const location = useLocation();

  const data = location.state;

  console.log(data, 'DATA');

  return <div>NoteUpdate</div>;
};

export default NoteUpdate;
