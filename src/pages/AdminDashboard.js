import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminAnalytics from './AdminAnalytics';

export default function AdminDashboard() {
  const [ewastes, setEwastes] = useState([]);
  const [pickupPersons, setPickupPersons] = useState([]);
  const [users, setUsers] = useState([]);

  // menu states
  const [showMenu, setShowMenu] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, () => {});
  }, []);

  useEffect(() => {
    const unsubE = onSnapshot(collection(db, 'ewasteSubmissions'), (snap) =>
      setEwastes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const q = query(collection(db, 'users'), where('role', '==', 'pickup'));
    const unsubP = onSnapshot(q, (snap) =>
      setPickupPersons(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const loadUsers = async () => {
      const all = await getDocs(collection(db, 'users'));
      setUsers(all.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadUsers();
    return () => {
      unsubE();
      unsubP();
    };
  }, []);

  const assignPickup = async (ewasteId, pickupId, pickupName) => {
    await updateDoc(doc(db, 'ewasteSubmissions', ewasteId), {
      pickupPersonId: pickupId,
      pickupPersonName: pickupName,
      status: 'Assigned'
    });
    alert('Assigned');
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  // DELETE FUNCTION WITH STATUS CHECK
  const deleteWaste = async (waste) => {
    if (waste.status !== "Collected") {
      alert("Can't delete: Only COLLECTED waste can be deleted");
      return;
    }

    try {
      await deleteDoc(doc(db, "ewasteSubmissions", waste.id));
      alert("Deleted Successfully");
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // PROMOTE USER FUNCTION
  const promoteUser = async (uid, newRole) => {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
    alert(`User promoted to ${newRole}`);
  };

  // STATUS ICON FUNCTION
  const getStatusIcon = (status) => {
    if (status === "Collected") return "🟢";
    if (status === "Assigned") return "🟡";
    return "🔴"; // Pending
  };

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex items-center gap-3">
          {/* THREE DOT MENU */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-3xl font-bold px-2 py-1 rounded hover:bg-gray-200"
          >
            ⋮
          </button>

          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* OPTIONS MENU */}
      {showMenu && (
        <div className="absolute right-10 top-16 bg-white shadow-xl rounded p-3 w-40">
          <p
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setShowDeleteList(true);
              setShowMenu(false);
            }}
          >
            Delete
          </p>

          <p
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setShowUserList(true);
              setShowMenu(false);
            }}
          >
            User
          </p>

          <p
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setShowPickupList(true);
              setShowMenu(false);
            }}
          >
            Pickup
          </p>
        </div>
      )}

      {/* DELETE LIST */}
      {showDeleteList && (
        <div className="absolute right-10 top-28 bg-white shadow-xl rounded p-4 w-72 max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-2">Delete Submitted Waste</h3>

          {ewastes.map((e) => (
            <div key={e.id} className="border-b p-2 flex justify-between items-center">
              <p>
                {getStatusIcon(e.status)} {e.ewasteType} ({e.quantity})
              </p>
              <button
                className={`px-2 py-1 rounded text-sm text-white ${
                  e.status === "Collected" ? "bg-red-500" : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() => deleteWaste(e)}
                disabled={e.status !== "Collected"}
              >
                Delete
              </button>
            </div>
          ))}

          <p
            className="text-center text-red-500 cursor-pointer mt-2"
            onClick={() => setShowDeleteList(false)}
          >
            Close
          </p>
        </div>
      )}

      {/* USER LIST POPUP WITH PROMOTE */}
      {showUserList && (
        <div className="absolute right-10 top-28 bg-white shadow-xl rounded p-4 w-80 max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-2">Users ({users.length})</h3>
          {users.map((u) => (
            <div key={u.id} className="border-b p-2 flex justify-between items-center">
              <p>{u.name || u.email} • role: {u.role}</p>
              <div className="flex gap-1">
                {u.role !== 'pickup' && (
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() => promoteUser(u.id, 'pickup')}
                  >
                    Make Pickup
                  </button>
                )}
                {u.role !== 'admin' && (
                  <button
                    className="px-2 py-1 bg-yellow-600 text-white rounded text-xs"
                    onClick={() => promoteUser(u.id, 'admin')}
                  >
                    Make Admin
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-center text-red-500 cursor-pointer mt-2" onClick={() => setShowUserList(false)}>
            Close
          </p>
        </div>
      )}

      {/* PICKUP LIST POPUP */}
      {showPickupList && (
        <div className="absolute right-10 top-28 bg-white shadow-xl rounded p-4 w-72 max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-2">Pickup Persons ({pickupPersons.length})</h3>
          {pickupPersons.map((p) => (
            <p key={p.id} className="border-b p-2">{p.name || p.email}</p>
          ))}
          <p className="text-center text-red-500 cursor-pointer mt-2" onClick={() => setShowPickupList(false)}>
            Close
          </p>
        </div>
      )}

      {/* ORIGINAL SUBMISSION LIST */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">E-Waste Submissions</h2>
        {ewastes.length === 0 ? (
          <p>No submissions</p>
        ) : (
          ewastes.map((e) => (
            <div key={e.id} className="bg-white p-3 rounded shadow mb-2">
              <p><strong>User:</strong> {e.email}</p>
              <p><strong>Type:</strong> {e.ewasteType}</p>
              <p><strong>Qty:</strong> {e.quantity}</p>
              <p><strong>Phone:</strong> {e.phone}</p>
              <p><strong>Status:</strong> {getStatusIcon(e.status)} {e.status}</p>

              {e.status === 'Pending' && (
                <select
                  className="mt-2 p-2 border"
                  onChange={(ev) => {
                    const val = ev.target.value;
                    if (!val) return;
                    const [pid, pname] = val.split('||');
                    assignPickup(e.id, pid, pname);
                  }}
                >
                  <option value="">Assign pickup</option>
                  {pickupPersons.map((p) => (
                    <option key={p.id} value={`${p.id}||${p.name || p.email}`}>
                      {p.name || p.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))
        )}
      </section>

      <AdminAnalytics />
    </div>
  );
}
