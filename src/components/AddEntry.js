import React, { useState, useEffect } from "react";
import { addUserEntry } from "../api/dynamo";
import { useNavigate } from "react-router-dom";
import "./AddEntry.css";
import adminBg from "../images/admin.jpg";

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
    
    useEffect(() => {
        // Add body background when component mounts
        document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${adminBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        
        // Reset background when component unmounts
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
        };
    }, []);

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
            await addUserEntry(formData);
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
            <p className="form-description">Create a new user assessment entry with login credentials.</p>
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
                        className="text-input"
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
                        className="email-input"
                    />
                </div>
                <div className="form-group">
                    <label>Strengths</label>
                    <textarea
                        placeholder="Strengths"
                        value={formData.strengths}
                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                        rows="5"
                    />
                </div>
                <div className="form-group">
                    <label>Weaknesses</label>
                    <textarea
                        placeholder="Weaknesses"
                        value={formData.weaknesses}
                        onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                        rows="5"
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
