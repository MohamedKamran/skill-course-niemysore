import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

function CarList() {
    const [cars, setCars] = useState([]);
    
    const readAllCars = async () => {
        try {
            const baseUrl = 'http://localhost:8080';
            const response = await axios.get(`${baseUrl}/cars`);
            const queriedCars = response.data;
            setCars(queriedCars);
        } catch(error) {
            alert('Server Error');
        }
    };

    const deleteCar = async (id) => {
        if(!window.confirm("Are you sure to delete?")) {
            return;
        }
        const baseUrl = "http://localhost:8080"
        try {
            const response = await axios.delete(`${baseUrl}/cars/${id}`)
            alert(response.data.message)
            await readAllCars();
        } catch(error) {
            alert('Server Error');
        }
    };
    
    useEffect(() => {
        readAllCars();
    }, []);

    // Transform cars data for DataTable
    const tableData = cars.map(car => [
        car.id,
        car.number,
        car.model,
        car.type,
        `<div>
            <a href="/cars/view/${car.id}" class="btn btn-success">View</a>
            <a href="/cars/edit/${car.id}" class="btn btn-warning">Edit</a>
            <button class="btn btn-danger delete-btn" data-id="${car.id}">Delete</button>
        </div>`
    ]);

    return (
        <>
            <PageHeader />
            <h3>List of Cars</h3>
            <div className="container">
                <DataTable 
                    data={tableData}
                    className="display table table-striped"
                    options={{
                        responsive: true,
                        dom: 'Bfrtip',
                        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                        drawCallback: function(settings) {
                            // Add click handlers for delete buttons
                            document.querySelectorAll('.delete-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    deleteCar(btn.dataset.id);
                                });
                            });
                        }
                    }}
                >
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Car Number</th>
                            <th>Model</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </>
    );
}

export default CarList;