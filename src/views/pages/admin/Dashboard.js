import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const jobsRef = collection(db, 'jobs');
      const totalSnap = await getCountFromServer(jobsRef);
      const pendingSnap = await getCountFromServer(query(jobsRef, where('status', '==', 'pending')));
      const acceptedSnap = await getCountFromServer(query(jobsRef, where('status', '==', 'accepted')));
      const completedSnap = await getCountFromServer(query(jobsRef, where('status', '==', 'completed')));

      setStats({
        total: totalSnap.data().count,
        pending: pendingSnap.data().count,
        accepted: acceptedSnap.data().count,
        completed: completedSnap.data().count,
      });
    };
    fetchStats();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <CRow>
        <CCol sm={3}>
          <CCard className="mb-3" color="primary" textColor="white">
            <CCardHeader>Tổng số đơn</CCardHeader>
            <CCardBody>
              <h2>{stats.total}</h2>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3" color="warning" textColor="white">
            <CCardHeader>Chưa xử lý</CCardHeader>
            <CCardBody>
              <h2>{stats.pending}</h2>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3" color="info" textColor="white">
            <CCardHeader>Đang chờ thợ</CCardHeader>
            <CCardBody>
              <h2>{stats.accepted}</h2>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3" color="success" textColor="white">
            <CCardHeader>Đã hoàn thành</CCardHeader>
            <CCardBody>
              <h2>{stats.completed}</h2>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;