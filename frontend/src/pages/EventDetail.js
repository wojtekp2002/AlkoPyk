import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [message, setMessage] = useState('');
  const [drinkData, setDrinkData] = useState({ name: '', volume: 0, cost: 0 });

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  const fetchEvent = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventData(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd pobierania eventu');
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/events/join`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Dołączono do imprezy');
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd dołączania do imprezy');
    }
  };

  const handleAddDrink = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/events/addDrink`,
        { eventId: id, ...drinkData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Dodano drink');
      // Czyszczenie formularza
      setDrinkData({ name: '', volume: 0, cost: 0 });
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd dodawania drinka');
    }
  };

  const handleEnd = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/events/end`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Impreza zakończona');
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd zakończenia imprezy');
    }
  };

  if (!eventData) return <div>{message || 'Ładowanie...'}</div>;

  return (
    <div>
      <h2>Szczegóły imprezy</h2>
      {message && <p>{message}</p>}

      <p><b>Tytuł:</b> {eventData.title}</p>
      <p><b>isActive:</b> {eventData.isActive ? 'Tak' : 'Nie'}</p>
      <p><b>Gospodarz (host):</b> {eventData.host}</p>
      <p><b>Uczestnicy (IDs):</b> {eventData.participants.join(', ')}</p>

      <h3>Drinki:</h3>
      <ul>
        {eventData.drinks.map((d, i) => (
          <li key={i}>
            {d.name} - {d.volume} ml, koszt: {d.cost}
          </li>
        ))}
      </ul>

      <button onClick={handleJoin}>Dołącz do imprezy</button>
      <button onClick={handleEnd}>Zakończ imprezę</button>

      <h3>Dodaj Drink</h3>
      <form onSubmit={handleAddDrink}>
        <div>
          <label>Nazwa trunku:</label>
          <input
            type="text"
            value={drinkData.name}
            onChange={e => setDrinkData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <label>Objętość (ml):</label>
          <input
            type="number"
            value={drinkData.volume}
            onChange={e => setDrinkData(prev => ({ ...prev, volume: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label>Koszt:</label>
          <input
            type="number"
            value={drinkData.cost}
            onChange={e => setDrinkData(prev => ({ ...prev, cost: Number(e.target.value) }))}
          />
        </div>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}

export default EventDetail;