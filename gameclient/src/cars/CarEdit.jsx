import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios'

function CarEdit() {
    const [car, setCar] = useState({
        id: '',
        title: '',
        description: '',
        no_of_players: '',
        ratings: ''
    });
    
    const params = useParams();
    const navigate = useNavigate();

    const txtBoxOnChange = event => {
        const updatableCar = {...car};
        updatableCar[event.target.id] = event.target.value;
        setCar(updatableCar);
    };

    const readById = async () => {
        const baseUrl = "http://localhost:8080"
        try {
            const response = await axios.get(`${baseUrl}/games/${params.id}`)
            const queriedCar = response.data;
            setCar(queriedCar);
        } catch(error) {
            alert('Server Error');
        }
    };

    const updateCar = async () => {
        const baseUrl = "http://localhost:8080"
        try {
            const response = await axios.put(`${baseUrl}/games/${params.id}`, {...car})
            const updatedCar = response.data.car;
            setCar(updatedCar);
            alert(response.data.message)
            navigate('/cars/list')
        } catch(error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readById();
    },[]);

    return(
        <>
            <PageHeader/>
            
            <h3><a href="/games/list" className="btn btn-light">Go Back</a>Edit Game</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label">Game Title:</label>
                    <input type="text" className="form-control" id="title" 
                        placeholder="Please enter game title"
                        value={car.title} 
                        onChange={txtBoxOnChange}/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" 
                        placeholder="Please enter game description"
                        value={car.description} 
                        onChange={txtBoxOnChange}/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="no_of_players" className="form-label">Number of Players:</label>
                    <input type="number" className="form-control" id="no_of_players" 
                        placeholder="Please enter number of players"
                        value={car.no_of_players} 
                        onChange={txtBoxOnChange}/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="ratings" className="form-label">Ratings:</label>
                    <input type="number" className="form-control" id="ratings" 
                        placeholder="Please enter ratings (0-5)"
                        step="0.1"
                        min="0"
                        max="5"
                        value={car.ratings} 
                        onChange={txtBoxOnChange}/>
                </div>
                <button className="btn btn-warning"
                    onClick={updateCar}>Update Game</button>
            </div>
        </>
    );
}

export default CarEdit;