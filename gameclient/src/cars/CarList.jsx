import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import axios from 'axios'

function CarList() {
    const [cars, setCars]= useState([{
        id: '',
        title: '',
        description: '',
        no_of_players: '',
        ratings: ''
    }])

    const readAllCars = async () => {
        try {
            const baseUrl = 'http://localhost:8080';
            const response = await axios.get(`${baseUrl}/games`);
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
            const response = await axios.delete(`${baseUrl}/games/${id}`)
            alert(response.data.message)
            await readAllCars();
        } catch(error) {
            alert('Server Error');
        }
    };
    
    useEffect(()=>{
        readAllCars();
    },[]);

    return (
        <>
            <PageHeader />
            <h3>List of Games</h3>
            <div className="container">
                <table className="table table-success table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Players</th>
                            <th scope="col">Rating</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                        {(cars && cars.length > 0) ? cars.map(
                            (car) =>  {return (<tr key={car.id}>
                                <th scope="row">{car.id}</th>
                                <td>{car.title}</td>
                                <td>{car.description}</td>
                                <td>{car.no_of_players}</td>
                                <td>{car.ratings}</td>
                                <td>
                                    <a href={`/games/view/${car.id}`} 
                                        className="btn btn-success">View</a>
                                    &nbsp;
                                    <a href={`/games/edit/${car.id}`} 
                                        className="btn btn-warning">Edit</a>
                                    &nbsp;
                                    <button  
                                        className="btn btn-danger"
                                        onClick={()=>deleteCar(car.id)}>Delete</button>
                                </td>
                            </tr>);}
                        ) : <tr><td colSpan="6">No Games Found</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default CarList;