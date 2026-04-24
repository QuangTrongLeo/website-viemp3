import Header from '~/components/Components/Header';

function BaseLayout({
  children,
  renderMainContent,
  isLoggedIn,
  onToggleAvatarMenu,
  onToggleNotificationTablet,
  bellButtonRef,
}) {
  return (
    <div>
      <Header
        isLoggedIn={isLoggedIn}
        onToggleAvatarMenu={onToggleAvatarMenu}
        onToggleNotificationTablet={onToggleNotificationTablet}
        bellButtonRef={bellButtonRef}
      />

      {renderMainContent?.() || (
        <div className="container-fluid">
          <div className="content">{children}</div>
        </div>
      )}
    </div>
  );
}

export default BaseLayout;
