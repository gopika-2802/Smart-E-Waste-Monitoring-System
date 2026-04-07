import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaRecycle } from 'react-icons/fa';

export default function SubmitEwaste() {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login first');

    try {
      await addDoc(collection(db, 'ewasteSubmissions'), {
        userId: user.uid,
        email: user.email,
        ewasteType: type,
        quantity: Number(quantity),
        address,
        phone,
        status: 'Pending',
        pickupPersonId: '',
        pickupPersonName: '',
        createdAt: serverTimestamp()
      });
      alert('Submitted!');
      navigate('/user');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      
      {/* Recycle Icons Row */}
      <div className="flex justify-center gap-6 mb-4">
        <FaRecycle className="text-green-300 text-4xl" />
        <FaRecycle className="text-green-500 text-5xl" />
        <FaRecycle className="text-green-700 text-4xl" />
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
        Submit Your E-Waste
      </h2>

      {/* Subtitle / quote */}
      <p className="text-center text-sm text-green-600 italic mb-6">
        "Recycling today ensures a cleaner tomorrow."
      </p>

      {/* Form */}
      <form onSubmit={handle} className="bg-white p-6 rounded-lg shadow-lg">
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="E-waste Type"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="number"
          min="1"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
        <input
          className="w-full mb-5 p-2 border rounded"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}
