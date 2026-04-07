
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminAnalytics(){
  const [ewastes, setEwastes] = useState([]);
  useEffect(()=> {
    const unsub = onSnapshot(collection(db, 'ewasteSubmissions'), (snap)=> setEwastes(snap.docs.map(d=> d.data())));
    return unsub;
  }, []);

  const pending = ewastes.filter(e=> e.status === 'Pending').length;
  const assigned = ewastes.filter(e=> e.status === 'Assigned').length;
  const collected = ewastes.filter(e=> e.status === 'Collected').length;

  const data = {
    labels: ['Pending','Assigned','Collected'],
    datasets: [{ label: 'E-Waste', data: [pending, assigned, collected], backgroundColor: ['#f59e0b','#3b82f6','#10b981'] }]
  };

  return (
    <div className="max-w-2xl mt-6">
      <h3 className="text-lg font-semibold mb-2">Analytics</h3>
      <Bar data={data} />
    </div>
  );
}
