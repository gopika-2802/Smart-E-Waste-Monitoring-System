import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { FaRecycle, FaUserCircle } from 'react-icons/fa';

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState({ name: '', email: '' });
  const [submissions, setSubmissions] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Assigned: 0,
    Collected: 0
  });

  const quotes = [
    "Reduce, Reuse, Recycle!",
    "Your small action can change the world.",
    "Recycling today for a better tomorrow.",
    "Every bit of e-waste properly disposed counts."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile({ name: user.displayName || 'User', email: user.email });

        const q = query(
          collection(db, 'ewasteSubmissions'),
          where('userId', '==', user.uid)
        );

        const unsubSnap = onSnapshot(q, (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setSubmissions(data);

          const counts = { Pending: 0, Assigned: 0, Collected: 0 };
          data.forEach(item => {
            if (counts[item.status] !== undefined) counts[item.status]++;
          });
          setStatusCounts(counts);
        });

        return () => unsubSnap();
      }
    });

    return unsubAuth;
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      window.location.href = "/";
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-4xl text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Quick Link */}
      <Link to="/submit" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded mb-6">
        <FaRecycle /> Submit E-Waste
      </Link>

      {/* Status Summary */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FaRecycle /> Submission Status
        </h2>
        <p><strong>Pending:</strong> {statusCounts.Pending}</p>
        <p><strong>Assigned:</strong> {statusCounts.Assigned}</p>
        <p><strong>Collected:</strong> {statusCounts.Collected}</p>
      </div>

      {/* History */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FaRecycle /> Submission History
        </h2>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          submissions.map(s => (
            <div key={s.id} className="border p-3 rounded mb-2">
              <p><strong>Type:</strong> {s.ewasteType}</p>
              <p><strong>Quantity:</strong> {s.quantity}</p>
              <p><strong>Status:</strong> {s.status}</p>
              {s.pickupPersonName && (
                <p><strong>Pickup Person:</strong> {s.pickupPersonName}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quote */}
      <div className="bg-green-100 p-4 rounded shadow text-center text-gray-700 italic">
        "{randomQuote}"
      </div>
    </div>
  );
}
