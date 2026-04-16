import React, { useEffect, useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton } from '@coreui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('customer');

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', roleFilter));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    };
    fetchUsers();
  }, [roleFilter]);

  return (
    <>
      <h1>Quản lý người dùng</h1>
      <div className="mb-3">
        <CButton color={roleFilter === 'customer' ? 'primary' : 'secondary'} onClick={() => setRoleFilter('customer')}>
          Khách hàng
        </CButton>
        <CButton color={roleFilter === 'provider' ? 'primary' : 'secondary'} onClick={() => setRoleFilter('provider')} className="ms-2">
          Thợ
        </CButton>
      </div>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Tên</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>SĐT</CTableHeaderCell>
            <CTableHeaderCell>Vai trò</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map(user => (
            <CTableRow key={user.id}>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.phone}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  );
};

export default Users;