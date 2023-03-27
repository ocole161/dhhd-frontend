import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import SpecialEdit from "./SpecialEdit"
import MapSingle from "./MapSingle"
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/esm/Spinner"


function SpecialView({neighborhoods, times, onUpdateSpecial }) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);
    const { id } = useParams()
    const user = useSelector((state) => state.user);
    const specials = useSelector((state) => state.specials);
    const special = specials.find((special) => special.id === parseInt(id))
    
    // Take datetimes and convert them to XX:XX am/pm format
    const startTime = new Date(special.start_time);
    const endTime = new Date(special.end_time);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC'};
    const startTimeString = startTime.toLocaleTimeString('eng-US', options);
    const endTimeString = endTime.toLocaleTimeString('eng-US', options)
    
    const [userRating, setUserRating] = useState({
        rating: "",
        user_id: null,
        special_id: null,
    });

    // Set the user's rating if one exists
    useEffect(() => {
        fetch("/user_special_reviews")
        .then(res => res.json())
        .then(reviews => {
            const userReview = reviews.find(review => review.user.id === user.id && review.special.id === parseInt([id]))
            if (userReview) {
                setUserRating({
                    id: userReview.id,
                    rating: userReview.rating,
                    user_id: userReview.user.id,
                    special_id: userReview.special.id
                    }
                )}
        })
    }, [id, user.id])

    // Set a flag to request deletion for admin to review, but don't delete
    function requestDelete(e) {
        e.preventDefault();
        fetch(`/specials/${special.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({...special, needs_delete_review: true}),
        })
        .then(r => {
            if(r.ok) {
                r.json().then(
                    navigate("/"),
                    window.alert("Your deletion request will be reviewed by an administrator soon.")
                )
            } else {
                r.json().then(json => setErrors(json.error))
            }
        })
    }

    // If this is the first time a user has rated a special, create a new user_special_review, otherwise update the existing user_special_review
    function changeRating(e) {
        if(userRating.user_id === null) {
            const formData = {
                user_id: user.id,
                special_id: id,
                rating: e.target.value,
            }
            fetch("/user_special_reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            .then(r => {
                if(r.ok) {
                    r.json().then(
                    setUserRating(formData)
                    )
                } else {
                    r.json().then(json => setErrors(json.error))
                }
            })
        } else {
            setUserRating({...userRating, rating: e.target.value})
            userRating.rating = e.target.value
            fetch(`/user_special_reviews/${userRating.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(userRating)
            })
            .then(r => {
                if(r.ok) {
                    r.json().then(
                    )
                } else {
                    r.json().then(json => setErrors(json.error))
                }
            })
        }
    }

    // Show spinner if specials haven't loaded yet
    if(special === undefined) {
        return (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        );
    } 

    return (
        <>
        <h1 className="special-view-title">{special.location_name}</h1>
        <Image rounded="true" src={special.location_image} alt={special.location_name} />
        <h3>Happy Hour: {startTimeString} - {endTimeString}</h3>
        <h3>Days: 
            {special.monday ? " Monday" : null}
            {special.tuesday ? " Tuesday" : null}
            {special.wednesday ? " Wednesday": null}
            {special.thursday ? " Thursday" : null}
            {special.friday ? " Friday" : null}
            {special.saturday ? " Saturday" : null}
            {special.sunday ? " Sunday" : null}
        </h3>
        <p>{special.location_address}</p>
        <p>Specials: {special.hh_special_text}</p>
        <a href={special.location_url}>Website</a>
        <Form.Group>
            <Form.Label>Your Rating</Form.Label>
            <Form.Select name="rating" value={userRating ? userRating.rating : ""} onChange={changeRating}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </Form.Select>
        </Form.Group>
        <SpecialEdit special={special} neighborhoods={neighborhoods} times={times} onUpdateSpecial={onUpdateSpecial} />
        <Button onClick={requestDelete}>Request Deletion</Button>
        {errors ? <Alert variant="warning" >{errors}</Alert> : null}
        <MapSingle special={special} />
        </>
    )
}
export default SpecialView
