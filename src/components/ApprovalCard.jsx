import Button from './Button';
export default function ApprovalCard({ user, onApprove, onReject }) {
  return (
    <div className="approval-card">
      <div className="user-info">
        <p><strong>Name:</strong> {user.nombre}</p>
        <p><strong>Username:</strong> {user.numero_empleado}</p>
        <p><strong>Email:</strong> {user.correo}</p>
      </div>
      <div className="actions">
        <Button onClick={() => onApprove(user.numero_empleado)}>Approve</Button>
        <Button onClick={() => onReject(user.numero_empleado)}>Reject</Button>
      </div>
    </div>
  );
}
