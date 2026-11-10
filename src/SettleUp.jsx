import { useState } from "react";
import { apiFetch } from "./api";

function SettleUp({ groupId, members, onSettled }) {
  const [paidBy, setPaidBy] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSettle = () => {
    if (!paidBy || !paidTo || !amount) {
      alert("Please fill in all fields");
      return;
    }
    if (paidBy === paidTo) {
      alert("Payer and receiver must be different people");
      return;
    }

    apiFetch(`/groups/${groupId}/settle`, {
      method: "POST",
      body: JSON.stringify({ paidBy, paidTo, amount: Number(amount) }),
    })
      .then((response) => response.json())
      .then(() => {
        setPaidBy("");
        setPaidTo("");
        setAmount("");
        onSettled();
      });
  };

  return (
    <div className="card">
      <h3>Settle Up</h3>
      <div className="form">
        <div className="field">
          <label htmlFor="settlePayer">Who paid</label>
          <select
            id="settlePayer"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select a member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="settleReceiver">Paid to</label>
          <select
            id="settleReceiver"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
          >
            <option value="">Select a member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="settleAmount">Amount (₹)</label>
          <input
            id="settleAmount"
            type="number"
            placeholder="e.g. 150"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button onClick={handleSettle}>Settle</button>
      </div>
    </div>
  );
}

export default SettleUp;