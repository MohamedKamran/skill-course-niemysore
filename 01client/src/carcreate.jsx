import React, { useState } from 'react'

export default function CarCreate() {
    const [formData, setFormData] = useState({
        ownerName: '',
        carId: '',
        carName: '',
        type: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add your API call or data processing logic
        console.log('Form submitted:', formData);
        // Reset form after submission
        setFormData({
            ownerName: '',
            carId: '',
            carName: '',
            type: ''
        });
        console.log('Form reset:', formData);
    };

    return (
        <div>
            <div className="container mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter owner name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Car ID</label>
                        <input
                            type="text"
                            name="carId"
                            value={formData.carId}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter car ID"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Car Name</label>
                        <input
                            type="text"
                            name="carName"
                            value={formData.carName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter car name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Select car type</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="hatchback">Hatchback</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
