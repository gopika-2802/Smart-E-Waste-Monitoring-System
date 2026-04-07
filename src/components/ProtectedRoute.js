
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          setAllowed(false);
          setLoading(false);
          return;
        }
        const role = snap.data().role;
        setAllowed(allowedRoles.includes(role));
      } catch (err) {
        console.error(err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [allowedRoles]);

  if (loading) return <div className="p-8">Loading...</div>;
  return allowed ? children : <Navigate to="/" replace />;
}
