import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase'; // Điều chỉnh đường dẫn đúng
import {
  CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput,
  CInputGroup, CInputGroupText, CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({ userName: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!account.userName || !account.password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Đăng nhập Firebase Auth (userName là email)
      const userCredential = await signInWithEmailAndPassword(auth, account.userName, account.password);
      const user = userCredential.user;

      // 2. Lấy thông tin role/permissions từ Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }
      const userData = userDoc.data();

      // 3. Chỉ cho phép admin (role = 'admin')
      if (userData.role !== 'admin') {
        await auth.signOut();
        throw new Error('Bạn không có quyền truy cập');
      }

      // 4. Lưu auth vào localStorage
      const loginData = {
        user: {
          uid: user.uid,
          email: user.email,
          fullName: userData.name || user.email,
          role: userData.role,
          permissions: userData.permissions || userData.role,
        },
        loginDate: new Date().toISOString(),
      };
      localStorage.setItem('auth', JSON.stringify(loginData));

      // 5. Chuyển hướng và reload để cập nhật menu
      navigate('/dashboard', { replace: true });
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleLogin}>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  {error && <p className="text-danger">{error}</p>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="userName"
                      value={account.userName}
                      onChange={handleInput}
                      disabled={loading}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      name="password"
                      value={account.password}
                      onChange={handleInput}
                      disabled={loading}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Login'}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" className="px-0">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;