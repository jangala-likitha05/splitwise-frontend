import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import SettleUp from "./SettleUp";
import { apiFetch } from "./api";

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});

  const fetchGroup = () => {
    apiFetch(`/groups/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.members) setGroup(data);
      });
  };

  const fetchExpenses = () => {
    apiFetch(`/groups/${id}/expenses`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setExpenses(data);
      });
  };

  const fetchBalances = () => {
    apiFetch(`/groups/${id}/balances`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) setBalances(data);
      });
  };

  const deleteExpense = (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;

    apiFetch(`/groups/${id}/expenses/${expenseId}`, { method: "DELETE" }).then(
      (response) => {
        if (!response.ok) {
          alert("Could not delete the expense");
          return;
        }
        fetchExpenses();
        fetchBalances();
      },
    );
  };

  const deleteGroup = () => {
    if (!window.confirm("Delete this group and all its expenses?")) return;

    apiFetch(`/groups/${id}`, { method: "DELETE" }).then((response) => {
      if (!response.ok) {
        alert("Only the group creator can delete this group");
        return;
      }
      navigate("/");
    });
  };

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
    fetchBalances();
  }, [id]);

  return (
    <div>
      <Link className="back-link" to="/">
        ← Back to groups
      </Link>
      <h1>Group Details</h1>

      {group && (
        <div>
          <div className="card">
            <h2>{group.name}</h2>
            <h3>Members</h3>
            {group.members.map((member) => (
              <div className="line" key={member._id}>
                {member.name}
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Balances</h3>
            {group.members.map((member) => {
              const amount = balances[member._id] || 0;
              return (
                <div className="line" key={member._id}>
                  <span>{member.name}</span>
                  <span className={amount >= 0 ? "positive" : "negative"}>
                    {amount >= 0 ? "is owed" : "owes"} ₹{Math.abs(amount)}
                  </span>
                </div>
              );
            })}
          </div>

          <AddExpense
            groupId={id}
            members={group.members}
            onExpenseAdded={() => {
              fetchExpenses();
              fetchBalances();
            }}
          />

          <SettleUp
            groupId={id}
            members={group.members}
            onSettled={fetchBalances}
          />

          <div className="card">
            <h3>Expenses</h3>
            {expenses.map((expense) => (
              <div className="line" key={expense._id}>
                <span>
                  {expense.description}
                  <span className="muted">
                    {" "}
                    · paid by {expense.paidBy.name}
                  </span>
                </span>
                <span>
                  ₹{expense.amount}{" "}
                  <button
                    className="danger"
                    onClick={() => deleteExpense(expense._id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>

          <button className="danger" onClick={deleteGroup}>
            Delete Group
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupDetails;