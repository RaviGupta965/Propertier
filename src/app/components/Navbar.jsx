'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>
        🏠 Property App
      </h1>

      <div className="space-x-4">
        <button onClick={() => router.push('/properties')}>Properties</button>
        {loggedIn && (
          <>
            <button onClick={() => router.push('/add-property')}>Add Property</button>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        )}
        {!loggedIn && (
          <>
            <button onClick={() => router.push('/login')}>Login</button>
            <button onClick={() => router.push('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
