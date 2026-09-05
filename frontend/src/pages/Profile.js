import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from '../BottomNav';
import { supabase } from '../supabaseClient';
import {
  Mail, Calendar, Shield, Bell, HelpCircle,
  Info, LogOut, ChevronRight, Edit2, X, Check, Eye, EyeOff
} from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    transactions: true,
    promotions: false,
    lowBalance: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        const date = new Date(user.created_at);
        setJoined(date.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const initials = email ? email.charAt(0).toUpperCase() : 'U';

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const toggleNotif = (key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { icon: <Edit2 size={18} />, label: 'Edit Profile', modal: 'edit' },
    { icon: <Shield size={18} />, label: 'Security & Privacy', modal: 'security' },
    { icon: <Bell size={18} />, label: 'Notifications', modal: 'notifications' },
    { icon: <HelpCircle size={18} />, label: 'Help & Support', modal: 'help' },
    { icon: <Info size={18} />, label: 'About CrystalPay', modal: 'about' },
  ];

  const closeModal = () => {
    setActiveModal(null);
    setPasswordMsg('');
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="card">
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <h2 className="profile-name">{email ? email.split('@')[0] : 'User'}</h2>
            <p className="profile-email">
              <Mail size={14} /> {email}
            </p>
            <p className="profile-joined">
              <Calendar size={14} /> Joined {joined}
            </p>
          </div>

          <div className="profile-menu">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="profile-menu-item"
                onClick={() => setActiveModal(item.modal)}
              >
                <span className="profile-menu-icon">{item.icon}</span>
                <span className="profile-menu-label">{item.label}</span>
                <ChevronRight size={18} className="profile-menu-chevron" />
              </button>
            ))}
          </div>

          <button className="btn-danger profile-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <BottomNav />

      {/* Edit Profile / Change Password Modal */}
      {(activeModal === 'edit' || activeModal === 'security') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <p className="modal-subtext">Email: {email}</p>
            <div className="password-field">
        <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
        />
            <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="btn-primary" onClick={handlePasswordUpdate}>
              Update Password
            </button>
            {passwordMsg && (
              <p style={{ color: passwordMsg.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
                {passwordMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notifications</h3>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="notif-row">
              <span>Transaction alerts</span>
              <button
                className={`toggle-switch ${notifPrefs.transactions ? 'on' : ''}`}
                onClick={() => toggleNotif('transactions')}
              >
                <span className="toggle-knob" />
              </button>
            </div>
            <div className="notif-row">
              <span>Promotions & offers</span>
              <button
                className={`toggle-switch ${notifPrefs.promotions ? 'on' : ''}`}
                onClick={() => toggleNotif('promotions')}
              >
                <span className="toggle-knob" />
              </button>
            </div>
            <div className="notif-row">
              <span>Low balance reminders</span>
              <button
                className={`toggle-switch ${notifPrefs.lowBalance ? 'on' : ''}`}
                onClick={() => toggleNotif('lowBalance')}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {activeModal === 'help' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Help & Support</h3>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <p className="modal-subtext">Need help? Reach out to us:</p>
            <div className="help-item">
              <Mail size={16} /> support@crystalpay.com
            </div>
            <p className="modal-subtext" style={{ marginTop: '16px' }}>
              Common questions:
            </p>
            <ul className="help-faq">
              <li>How do I fund my wallet? Go to Wallet → Fund Wallet.</li>
              <li>Transaction failed? Check your wallet balance and try again.</li>
              <li>Forgot password? Use "Change Password" under Edit Profile.</li>
            </ul>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>About CrystalPay</h3>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <p className="modal-subtext">
              CrystalPay is a fast and reliable platform for airtime, data, and electricity bill payments — built by Crystalife Tech.
            </p>
            <div className="about-feature">
              <Check size={16} /> Instant wallet funding via Paystack
            </div>
            <div className="about-feature">
              <Check size={16} /> Airtime & data top-ups for all networks
            </div>
            <div className="about-feature">
              <Check size={16} /> Electricity bill payments nationwide
            </div>
            <p className="modal-subtext" style={{ marginTop: '16px', fontSize: '12px' }}>
              Version 1.0.0
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;