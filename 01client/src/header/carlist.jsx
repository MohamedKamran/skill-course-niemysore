import React from 'react'

export default function CarList() {
    const cars= [
        {
            ownerName: 'John Doe',
            carId: 'CAR001',
            carName: 'Toyota Camry',
            type: 'Sedan'
        },
        {
            ownerName: 'Jane Smith',
            carId: 'CAR002',
            carName: 'Honda CR-V',
            type: 'SUV'
        },
        {
            ownerName: 'Mike Johnson',
            carId: 'CAR003',
            carName: 'Tesla Model 3',
            type: 'Electric'
        }
    ];

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Car List</h1>
            <div className="row g-4">
                {cars.map((car) => (
                    <div key={car.carId} className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="card-title">{car.carName}</h5>
                                    <span className="badge bg-primary">
                                        {car.type}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <p className="card-text">
                                        <strong>Owner:</strong> {car.ownerName}
                                    </p>
                                    <p className="card-text">
                                        <strong>ID:</strong> {car.carId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}