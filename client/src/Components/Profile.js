// Profile.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../Features/UserSlice';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import Location from './Location';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  // 🟢 Hooks
  const [userName, setUserName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = user?.token;

  // صورة البروفايل
  const picURL = profilePic
    ? URL.createObjectURL(profilePic)
    : user?.profilePic
    ? `http://localhost:3001/uploads/${user.profilePic}`
    : null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) setProfilePic(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      alert('User email not found. Please login again.');
      return;
    }

    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('email', user.email); // مهم جداً
    if (password) formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      setLoading(true);
      await dispatch(updateUserProfile({ formData, token })).unwrap();
      alert('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <Container fluid className="dashboard-wrapper">
      {/* اسم المستخدم والإيميل أعلى الصفحة */}
      <div className="user-header">
        <h2>Welcome, {user?.name || 'No Name'}!</h2>
        <p>Your email: {user?.email || 'No Email'}</p>
      </div>

      <Row>
        {/* بطاقة البروفايل */}
        <Col md={3}>
          <div className="profile-card">
            {picURL ? (
              <img src={picURL} alt="profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar empty-avatar">No Image</div>
            )}
            <h4 className="profile-name">{user?.name || 'No Name'}</h4>
            <p>
              <strong>Email:</strong> {user?.email || 'No Email'}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || 'N/A'}
            </p>
            <p>
              <strong>Joined:</strong> {user?.createdAt?.split('T')[0] || 'N/A'}
            </p>
          </div>

          <Location />
        </Col>

        {/* تعديل البروفايل */}
        <Col md={6}>
          <div className="edit-profile-section">
            <h2 className="section-title">Update Your Information</h2>

            <Form onSubmit={handleUpdate} className="profile-form">
              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Profile Picture</Label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="input-custom"
                />
                {profilePic && (
                  <img src={picURL} alt="preview" className="preview-img" />
                )}
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Full Name</Label>
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <Button
                color="primary"
                type="submit"
                className="update-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
