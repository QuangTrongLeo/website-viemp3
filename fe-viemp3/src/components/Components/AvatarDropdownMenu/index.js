import { Link } from 'react-router-dom';
import config from '~/config';
import icons from '~/assets/icons';
import { useAuth } from '../AuthProvider';

function AvatarDropdownMenu({ isMod, isAdmin }) {
  const { logout } = useAuth();
  return (
    <ul className="dropdown-menu custom-dropdown-left" aria-labelledby="navbarDropdownMenuLink">
      <li>
        <Link className="dropdown-item" to={config.routes.profile}>
          <i className={`${icons.iconUser} me-2`}></i> Hồ sơ
        </Link>
      </li>

      {/* MOD */}
      {isMod && (
        <>
          <li>
            <Link className="dropdown-item" to={config.routes.manage}>
              <i className="fas fa-users-cog me-2"></i> Quản lý hệ thống
            </Link>
          </li>
        </>
      )}

      <li>
        <hr className="dropdown-divider" />
      </li>
      <li>
        <Link className="dropdown-item" to={config.routes.home} onClick={logout}>
          <i className={`${icons.iconSignOut} me-2`}></i> Đăng xuất
        </Link>
      </li>
    </ul>
  );
}

export default AvatarDropdownMenu;
