import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { FaRecycle } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const quotes = [
    "Reduce, Reuse, Recycle!",
    "Your small action can change the world.",
    "Recycling today for a better tomorrow.",
    "Every bit of e-waste properly disposed counts."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        alert('Profile not found. Contact admin.');
        setLoading(false);
        return;
      }
      const role = snap.data().role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'pickup') navigate('/pickup');
      else navigate('/user');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Header with recycle icon */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <FaRecycle className="text-4xl text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">E-Waste Login</h2>
        </div>

        {/* Motivational quote */}
        <p className="text-center italic text-green-700 mb-6">"{randomQuote}"</p>

        {/* Login form */}
        <form onSubmit={handle} className="flex flex-col gap-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/signup" className="text-green-600 underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
