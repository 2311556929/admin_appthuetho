import React, { useEffect, useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1>Danh sách đơn hàng</h1>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Khách hàng</CTableHeaderCell>
            <CTableHeaderCell>Dịch vụ</CTableHeaderCell>
            <CTableHeaderCell>Địa chỉ</CTableHeaderCell>
            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
            <CTableHeaderCell>Giá dự kiến</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {orders.map(order => (
            <CTableRow key={order.id}>
              <CTableDataCell>{order.id.slice(0, 8)}</CTableDataCell>
              <CTableDataCell>{order.customerName}</CTableDataCell>
              <CTableDataCell>{order.serviceType}</CTableDataCell>
              <CTableDataCell>{order.customerAddress}</CTableDataCell>
              <CTableDataCell>{order.status}</CTableDataCell>
              <CTableDataCell>{order.estimatedPrice?.toLocaleString()}đ</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  );
};

export default Orders;