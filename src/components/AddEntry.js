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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        // Validate required fields
        if (!formData.name || !formData.email) {
            setError("Name and email are required");
            setIsSubmitting(false);
            return;
        }
        
        try {
            console.log("Submitting form data:", formData);
            await addUserEntry(formData);
            console.log("Entry added successfully");
            navigate("/admin"); // Redirect back to Admin panel
        } catch (error) {
            console.error("Error adding entry:", error);
            setError("Failed to add entry. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-entry-form">
            <h2>Add New Entry</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
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
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Entry"}
                </button>
            </form>
        </div>
    );
}

export default AddEntry;
