import React, { useState } from "react";
import { addUserEntry } from "../api/dynamo";
import { useNavigate } from "react-router-dom";
import "./AddEntry.css";

function AddEntry() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        strengths: "",
        weaknesses: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addUserEntry(formData);
            navigate("/admin"); // Redirect back to Admin panel
        } catch (error) {
            console.error("Error adding entry:", error);
        }
    };

    return (
        <div className="add-entry-form">
            <h2>Add New Entry</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Strengths</label>
                    <input
                        type="text"
                        placeholder="Strengths"
                        value={formData.strengths}
                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Weaknesses</label>
                    <input
                        type="text"
                        placeholder="Weaknesses"
                        value={formData.weaknesses}
                        onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                    />
                </div>
                <button type="submit">Add Entry</button>
            </form>
        </div>
    );
}

export default AddEntry;
