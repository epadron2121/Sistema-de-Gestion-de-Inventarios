import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function TestAccess() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restrictedCollection'));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
      } catch (err) {
        setError("No tienes permisos para ver esta colección.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Prueba de Acceso a Colección Restringida</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.nombre} - Cantidad: {item.cantidad}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestAccess;
