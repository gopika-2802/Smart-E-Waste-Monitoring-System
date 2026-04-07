import React, { useEffect, useState } from 'react';
import { query, collection, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function PickupDashboard() {
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get logged-in pickup person
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUserId(u ? u.uid : null);
    });
    return unsubAuth;
  }, []);

  // Fetch assigned tasks
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'ewasteSubmissions'),
      where('pickupPersonId', '==', userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [userId]);

  // Mark collected
  const markCollected = async (id) => {
    await updateDoc(doc(db, 'ewasteSubmissions', id), { status: 'Collected' });
    alert('Marked as Collected');
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pickup Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* No tasks */}
      {jobs.length === 0 ? (
        <p className="text-lg font-semibold text-gray-600">No assigned tasks</p>
      ) : (
        jobs.map((j) => (
          <div
            key={j.id}
            className="bg-white p-5 rounded-lg shadow-md border mb-4"
          >
            <p><strong>User:</strong> {j.email}</p>
            <p><strong>Type:</strong> {j.ewasteType}</p>
            <p><strong>Quantity:</strong> {j.quantity}</p>
            <p><strong>Address:</strong> {j.address}</p>

            {/* Phone + Call Button */}
            <div className="flex items-center gap-3 mt-3">
              <p><strong>Phone:</strong> {j.phone}</p>
              <a
                href={`tel:${j.phone}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                📞 Call User
              </a>
            </div>

            {/* Status */}
            <p className="mt-2">
              <strong>Status:</strong>{' '}
              <span className={j.status === "Collected" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                {j.status}
              </span>
            </p>

            {/* Mark collected */}
            {j.status !== 'Collected' && (
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => markCollected(j.id)}
              >
                Mark as Collected
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
