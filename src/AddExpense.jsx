import { useState } from "react";
import { apiFetch } from "./api";

function AddExpense({ groupId, members, onExpenseAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const handleAdd = () => {
    if (!description || !amount || !paidBy) {
      alert("Please fill in all fields");
      return;
    }

    apiFetch(`/groups/${groupId}/expenses`, {
      method: "POST",
      body: JSON.stringify({
        description,
        amount: Number(amount),
        paidBy,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setDescription("");
        setAmount("");
        setPaidBy("");
        onExpenseAdded();
      });
  };

  return (
    <div className="card">
      <h3>Add Expense</h3>
      <div className="form">
        <div className="field">
          <label htmlFor="desc">Description</label>
          <input
            id="desc"
            type="text"
            placeholder="e.g. Dinner"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            placeholder="e.g. 300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="paidBy">Paid by</label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAdd}>Add Expense</button>
      </div>
    </div>
  );
}

export default AddExpense;