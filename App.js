import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // اختبار الاتصال
  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/test-connection');
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'فشل في الاتصال بالخادم',
        error: error.message
      });
    }
    setLoading(false);
  };

  // جلب المستخدمين
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    }
    setLoading(false);
  };

  // إضافة مستخدم جديد
  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert('الرجاء إدخال جميع البيانات');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      if (data.success) {
        setNewUser({ name: '', email: '' });
        fetchUsers(); // تحديث القائمة
        alert('تم إضافة المستخدم بنجاح');
      } else {
        alert('فشل في إضافة المستخدم: ' + data.message);
      }
    } catch (error) {
      console.error('خطأ في إضافة المستخدم:', error);
      alert('فشل في إضافة المستخدم');
    }
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>نظام الاتصال بقاعدة البيانات PostgreSQL</h1>
        
        {/* قسم اختبار الاتصال */}
        <div className="section">
          <h2>اختبار الاتصال بقاعدة البيانات</h2>
          <button onClick={testConnection} disabled={loading}>
            {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
          </button>
          
          {connectionStatus && (
            <div className={`status ${connectionStatus.success ? 'success' : 'error'}`}>
              <h3>{connectionStatus.success ? '✅ نجح الاتصال' : '❌ فشل الاتصال'}</h3>
              <p>{connectionStatus.message}</p>
              {connectionStatus.postgresVersion && (
                <p><strong>إصدار PostgreSQL:</strong> {connectionStatus.postgresVersion}</p>
              )}
              {connectionStatus.error && (
                <p><strong>الخطأ:</strong> {connectionStatus.error}</p>
              )}
            </div>
          )}
        </div>

        {/* قسم إدارة المستخدمين */}
        <div className="section">
          <h2>إدارة المستخدمين</h2>
          
          {/* نموذج إضافة مستخدم */}
          <form onSubmit={addUser} className="user-form">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'جاري الإضافة...' : 'إضافة مستخدم'}
            </button>
          </form>

          {/* قائمة المستخدمين */}
          <button onClick={fetchUsers} disabled={loading}>
            {loading ? 'جاري التحديث...' : 'تحديث القائمة'}
          </button>

          <div className="users-list">
            <h3>قائمة المستخدمين ({users.length})</h3>
            {users.length === 0 ? (
              <p>لا يوجد مستخدمين</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>تاريخ الإضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleString('ar-SA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;