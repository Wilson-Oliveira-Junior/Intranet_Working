const NotificationsPage = ({ notifications }) => {
    if (!Array.isArray(notifications)) {
        return <div>Erro: Notificações não estão no formato esperado.</div>;
    }

    return (
        <div>
            {notifications.map((notification) => (
                <div key={notification.id}>{notification.message}</div>
            ))}
        </div>
    );
};
export default NotificationsPage;
