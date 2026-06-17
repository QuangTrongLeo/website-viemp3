import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AccountManage.module.scss';
import icons from '~/assets/icons';
import { images } from '~/assets';
import LimitedList from '~/components/Components/LimitedList';

import { apiGetUsers, apiUpdateUserRoles } from '~/api/services/serviceUsers';
import { apiGetRoles } from '~/api/services/serviceRoles';

const cx = classNames.bind(styles);

function AccountManage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleName, setSelectedRoleName] = useState('');

  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [userRes, roleRes] = await Promise.all([apiGetUsers(), apiGetRoles()]);
    setUsers(userRes);

    const rolesData = Array.isArray(roleRes) ? roleRes : roleRes?.data || [];
    setRoles(rolesData);
  };

  // ===== FILTER =====
  const filteredUsers = useMemo(() => {
    return users
      .filter(
        u =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter(u => {
        if (!filterRole) return true;
        return u.roles?.some(r => r.id === filterRole);
      });
  }, [users, search, filterRole]);

  // ===== OPEN UPDATE =====
  const handleOpenUpdate = user => {
    setSelectedUser(user);
    setSelectedRoleName('');
    setModalUpdate(true);
  };

  // ===== BUILD ROLE LOGIC =====
  const buildRoles = () => {
    const roleMap = Object.fromEntries(roles.map(r => [r.name, r]));

    let newRoles = [...(selectedUser.roles || [])];

    const hasRole = name => newRoles.some(r => r.name === name);
    const addRole = name => {
      if (!hasRole(name) && roleMap[name]) {
        newRoles.push(roleMap[name]);
      }
    };

    if (selectedRoleName === 'USER') {
      newRoles = [roleMap['USER']];
    }

    if (selectedRoleName === 'MOD') {
      addRole('USER');
      addRole('MOD');
    }

    if (selectedRoleName === 'PREMIUM') {
      addRole('USER');
      addRole('PREMIUM');
    }

    return newRoles;
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    try {
      const newRoles = buildRoles();
      const roleNames = newRoles.map(r => r.name);
      await apiUpdateUserRoles({
        userId: selectedUser.id,
        roles: roleNames,
      });
      const updated = users.map(u => (u.id === selectedUser.id ? { ...u, roles: newRoles } : u));
      setUsers(updated);
      setModalUpdate(false);
    } catch (err) {
      console.error(err);
      alert('Cập nhật role thất bại');
    }
  };

  // ===== DELETE (LOCAL DEMO) =====
  const handleOpenDelete = user => {
    setSelectedUser(user);
    setModalDelete(true);
  };

  const handleDelete = () => {
    const updated = users.filter(u => u.id !== selectedUser.id);
    setUsers(updated);
    setModalDelete(false);
  };

  // ===== RENDER =====
  const renderUser = user => (
    <div key={user.id} className={cx('user-item')}>
      <div className={cx('user-left')}>
        <img src={user.avatar || images.avatarDefault} alt="avatar" className={cx('avatar')} />

        <div>
          <div className={cx('username')}>{user.username}</div>
          <div className={cx('email')}>{user.email}</div>

          <div className={cx('role')}>{user.roles?.map(r => r.name).join(', ') || 'Chưa có role'}</div>
        </div>
      </div>

      <div className={cx('user-right')}>
        <div className={cx('actions')}>
          <button className="btn btn-sm btn-warning" onClick={() => handleOpenUpdate(user)}>
            <i className="fas fa-edit"></i>
          </button>

          <button className="btn btn-sm btn-danger" onClick={() => handleOpenDelete(user)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cx('wrapper')}>
      {/* HEADER */}
      <div className={cx('header')}>
        <h3>
          <i className={icons.iconUser}></i> Quản lý tài khoản
        </h3>
      </div>

      {/* TOOLBAR */}
      <div className={cx('toolbar')}>
        <input placeholder="Tìm theo username hoặc email..." value={search} onChange={e => setSearch(e.target.value)} />

        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">-- Role --</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearch('');
            setFilterRole('');
          }}
        >
          Reset
        </button>
      </div>

      {/* LIST */}
      <div className={cx('list')}>
        <LimitedList items={filteredUsers} renderItem={renderUser} />
      </div>

      {/* ===== MODAL UPDATE ===== */}
      {modalUpdate && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật Role</h4>

            <p>
              <b>{selectedUser?.username}</b>
            </p>

            <select value={selectedRoleName} onChange={e => setSelectedRoleName(e.target.value)}>
              <option value="">Chọn role</option>
              <option value="USER">USER</option>
              <option value="MOD">MOD</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>

            <div className={cx('modal-actions')}>
              <button className="btn btn-secondary" onClick={() => setModalUpdate(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL DELETE ===== */}
      {modalDelete && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Bạn có chắc muốn xóa?</h4>
            <p>{selectedUser?.username}</p>

            <div className={cx('modal-actions')}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa
              </button>
              <button className="btn btn-secondary" onClick={() => setModalDelete(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManage;
