import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addSpecial } from "../features/specialsSlice";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function CreateNewSpecial({ neighborhoods, times }) {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    // States for open/close Popup
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const [errors, setErrors] = useState(null);
    const [formData, setFormData] = useState({
        location_name: "",
        location_image: "",
        location_neighborhood: "",
        location_address: "",
        location_url: "",
        start_time: "",
        end_time: "",
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        beer: false,
        wine: false,
        cocktails: false,
        food: false,
        hh_special_text: "",
        needs_create_review: true,
        lat: null,
        lng: null,
    })
    const { location_name, location_image, location_neighborhood, location_address, location_url, start_time, end_time, hh_special_text, monday, tuesday, wednesday, thursday, friday, saturday, sunday, beer, wine, cocktails, food } = formData
    
    // Send the submitted address to GoogleMaps geocoder, set the returned lat and lng in the form
    const geocodeAddress = () => {
        const address = formData.location_address;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then(data => {
            const latitude = data.results[0].geometry.location.lat;
            const longitude = data.results[0].geometry.location.lng;
            formData.lat = latitude
            formData.lng = longitude
        })
        .catch(errors => {
            setErrors(errors);
        })
    }
    
    function handleChange(e) {
        e.preventDefault()
        const { name, value } = e.target
        setFormData({...formData, [name]: value})
    }

    function handleCheckboxChange(e) {
        const { name, checked } = e.target
        setFormData({...formData, [name]: checked})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        geocodeAddress();
        // Set default image if none specified
        if (formData.location_image === "") {
            formData.location_image = "https://i.pinimg.com/originals/0a/a4/0a/0aa40ab247b227aa9241fac7b28e77fc.jpg"
        }
        // Timeout to wait for geocode to complete
        setTimeout(() => {
            fetch("/specials", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })        
            .then(r => {
                if(r.ok) {
                    r.json().then(json => {
                        console.log(json)
                        dispatch(addSpecial(json))
                        setErrors(null)
                        closeModal()
                        navigate(`/specials/${json.id}`)
                })
                } else {
                    r.json().then(json => {
                        setErrors(json.error)
                        console.log(json)
                    })
                }
            })
        }, "100");
    }

    return (
        <>
        <Button onClick={() => setOpen(o => !o)}>Create New Special</Button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <h1>New Special Submission</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group >
                <Form.Label>Location Name</Form.Label>
                <Form.Control required type="text" name="location_name" value={location_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Location Image URL</Form.Label>
                <Form.Control type="url" name="location_image" value={location_image} onChange={handleChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Neighborhood</Form.Label>
                <Form.Select aria-label="Select" name="location_neighborhood" value={location_neighborhood} onChange={handleChange} >
                    <option value="">Select Neighborhood</option>
                    {neighborhoods.map(neighborhood => {
                        return <option key={neighborhood} value={neighborhood} >{neighborhood}</option>})}
                </Form.Select>
            </Form.Group>
            <Form.Group >
                <Form.Label>Location Address</Form.Label>
                <Form.Control required type="text" name="location_address" value={location_address} onChange={handleChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Website</Form.Label>
                <Form.Control type="url" name="location_url" value={location_url} onChange={handleChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Start Time:</Form.Label>
                <Form.Select aria-label="Select" name="start_time" value={start_time} onChange={handleChange} >
                    <option value="">Select Start Time</option>
                    {times.map(time => {
                        return <option key={time} value={time}>{time}</option>})}
                </Form.Select>
            </Form.Group>
            <Form.Group >
            <Form.Label>End Time:</Form.Label>
                <Form.Select aria-label="Select" name="end_time" value={end_time} onChange={handleChange} >
                    <option value="">Select End Time</option>
                    {times.map(time => {
                        return <option key={time} value={time}>{time}</option>})}
                </Form.Select>
            </Form.Group>
            <Form.Group >
                <Form.Label>Days of the Week</Form.Label>
                <div>
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Mon' name='monday' value={monday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Tue' name='tuesday' value={tuesday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Wed' name='wednesday' value={wednesday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Thu' name='thursday' value={thursday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Fri' name='friday' value={friday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Sat' name='saturday' value={saturday} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Sun' name='sunday' value={sunday} onChange={handleCheckboxChange} />
                </div>
            </Form.Group>
            <Form.Group >
                <Form.Label>Types of Specials</Form.Label>
                <div>
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Beer' name='beer' value={beer} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Wine' name='wine' value={wine} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Cocktails' name='cocktails' value={cocktails} onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" id='default-checkbox' label='Food' name='food' value={food} onChange={handleCheckboxChange} />
                </div>
            </Form.Group>
            <Form.Group >
                <Form.Label>Happy Hour Specials</Form.Label>
                <Form.Control as="textarea" rows="3" name="hh_special_text" value={hh_special_text} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            {errors ? <Alert variant="warning" >{errors}</Alert> : null}
        </Form>
        </Popup>
        </>
    )
}

export default CreateNewSpecial