import { useState } from "react"
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSpecial } from '../features/specialsSlice';
import Alert from 'react-bootstrap/esm/Alert';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';

function SpecialCardReview({ special }) {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState(null);

    // Take datetimes and convert them to XX:XX am/pm format
    const startTime = new Date(special.start_time);
    const endTime = new Date(special.end_time);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC'};
    const startTimeString = startTime.toLocaleTimeString('eng-US', options);
    const endTimeString = endTime.toLocaleTimeString('eng-US', options)

    // Remove both create and update review needed flags
    function setReviewed(e) {
        e.preventDefault();
        fetch(`https://dhhd-backend.onrender.com/specials/${special.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({...special, needs_create_review: false, needs_update_review: false}),
        })
        .then(r => {
            if(r.ok) {
                r.json().then((udpatedSpecial) => {
                dispatch(updateSpecial(udpatedSpecial))
                })
            } else {
                r.json().then(json => setErrors(json.error))
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    return (
        <Col>
            <Link to={`https://dhhd-backend.onrender.com/specials/${special.id}`} className="no-format-link">
            <Card style={{ width: '18rem' }} >
                <Card.Img className="card_image" variant="top" src={special.location_image} alt={special.location_name} />
                <Card.Body>
                    <Card.Title>{special.location_name}</Card.Title>
                    <Card.Text>{startTimeString} - {endTimeString}</Card.Text>
                    <Card.Text>Deals on: 
                        {special.beer ? " Beer" : null} 
                        {special.wine ? " Wine" : null} 
                        {special.cocktails ? " Cocktails" :null} 
                        {special.food ? " Food" : null}</Card.Text>
                </Card.Body>
                <Button onClick={setReviewed}>Mark Reviewed</Button>
                {errors ? <Alert variant="warning" >{errors}</Alert> : null}
            </Card>
            </Link>
        </Col>
    )
}

export default SpecialCardReview