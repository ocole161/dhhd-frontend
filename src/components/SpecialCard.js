import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

function SpecialCard({ special }) {

    // Take datetimes and convert them to XX:XX am/pm format
    const startTime = new Date(special.start_time);
    const endTime = new Date(special.end_time);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC'};
    const startTimeString = startTime.toLocaleTimeString('eng-US', options);
    const endTimeString = endTime.toLocaleTimeString('eng-US', options)

    const [ averageRating, setAverageRating ] = useState(null)
    
    useEffect(() => {
        fetch(`/special_average/${special.id}`)
        .then(r => r.json())
        .then(r => setAverageRating(r))
    })

    return (
        <Col>
            <Link to={`/specials/${special.id}`} className="no-format-link">
                <Card className="card" >
                    <Card.Img className="card_image" variant="top" src={special.location_image} alt={special.location_name} />
                    <Card.Body>
                        <Card.Title>{special.location_name}</Card.Title>
                        <Card.Text>Happy Hour: {startTimeString} - {endTimeString}</Card.Text>
                        <Card.Text>Deals on: 
                            {special.beer ? " Beer" : null} 
                            {special.wine ? " Wine" : null} 
                            {special.cocktails ? " Cocktails" :null} 
                            {special.food ? " Food" : null}
                        </Card.Text>
                        <Card.Text>Average User Rating: {averageRating ? averageRating : "No Ratings"} </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    )
}

export default SpecialCard