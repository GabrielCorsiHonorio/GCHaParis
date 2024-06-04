// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (!isLoggedIn) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Only logged in users can see this.</p>
    </div>
  );
};

export default Dashboard;
