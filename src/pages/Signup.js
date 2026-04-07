import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { FaRecycle } from 'react-icons/fa';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await setDoc(doc(db, 'users', uid), {
        uid,
        name,
        email,
        phone,
        role: 'user', // Signup always creates 'user'
        createdAt: serverTimestamp()
      });
      alert('Signup successful. Please login.');
      navigate('/');
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
          <h2 className="text-2xl font-bold text-green-600">Signup</h2>
        </div>

        {/* Motivational quote */}
        <p className="text-center italic text-green-700 mb-6">"{randomQuote}"</p>

        {/* Signup form */}
        <form onSubmit={handle} className="flex flex-col gap-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
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
          <p className="text-sm text-gray-600">
            Note: Role will be <strong>user</strong>. Admin can later promote to pickup/admin.
          </p>
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/" className="text-green-600 underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
