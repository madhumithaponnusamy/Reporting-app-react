export function IssueStatus({ issue, updateStatus }) {
  return (
    <tr>
      <td>{issue.userName}</td>
      <td>{issue.userEmail}</td>
      <td>{issue.problemDescription}</td>
      <td>{issue.area}</td>

      <td className="status-cell">
        <label>
          <input
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "Pending"}
            onChange={() => updateStatus(issue.issueId, "pending")}
          />
          Pending
        </label>

        <label>
          <input
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "inProgress"}
            onChange={() => updateStatus(issue.issueId, "inProgress")}
          />
          In Progress
        </label>

        <label>
          <input
            type="radio"
            name={`status-${issue.issueId}`}
            checked={issue.status === "Resolved"}
            onChange={() => updateStatus(issue.issueId, "resolved")}
          />
          Resolved
        </label>
      </td>
    </tr>
  );
}
