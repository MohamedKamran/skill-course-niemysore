import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios'

function CarView() {
    const [car, setCar] = useState({
        id: '',
        title: '',
        description: '',
        no_of_players: '',
        ratings: ''
    });
    
    const params = useParams();

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

    useEffect(() => {
        readById();
    },[]);

    return(
        <>
            <PageHeader/>
            
            <h3><a href="/games/list" className="btn btn-light">Go Back</a>View Game</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label">Game Title:</label>
                    <div className="form-control" id="title">{car.title}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <div className="form-control" id="description" style={{minHeight: "100px"}}>
                        {car.description}
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="no_of_players" className="form-label">Number of Players:</label>
                    <div className="form-control" id="no_of_players">{car.no_of_players}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="ratings" className="form-label">Ratings:</label>
                    <div className="form-control" id="ratings">{car.ratings}</div>
                </div>
            </div>
        </>
    );
}

export default CarView;