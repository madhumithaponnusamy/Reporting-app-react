export function IssueStatus({ issue, updateStatus }) {
  return (
    <tr>
      <td>{issue.userName}</td>
      <td>{issue.userEmail}</td>
      <td>{issue.problemDescription}</td>
      <td>{issue.area}</td>

    <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "Pending"}
            onChange={() => updateStatus(issue.issueId, "pending")}
          />
          <label className="form-check-label">Pending</label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "inProgress"}
            onChange={() => updateStatus(issue.issueId, "inProgress")}
          />
          <label className="form-check-label">In Progress</label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "Resolved"}
            onChange={() => updateStatus(issue.issueId, "resolved")}
          />
          <label className="form-check-label">Resolved</label>
        </div>
      </td>
    </tr>
  );
}
