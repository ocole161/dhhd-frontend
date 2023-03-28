import { useState } from "react";
import { useDispatch } from 'react-redux';
import { updateSpecial } from '../features/specialsSlice';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/esm/Alert';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function SpecialEdit({ neighborhoods, times, special }) {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState(null);

    // States for open/close Popup
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const [formData, setFormData] = useState({
        location_name: special.location_name,
        location_image: special.location_image,
        location_neighborhood: special.location_neighborhood,
        location_address: special.location_address,
        location_url: special.location_url,
        start_time: special.start_time,
        end_time: special.end_time,
        monday: special.monday,
        tuesday: special.tuesday,
        wednesday: special.wednesday,
        thursday: special.thursday,
        friday: special.friday,
        saturday: special.saturday,
        sunday: special.sunday,
        beer: special.beer,
        wine: special.wine,
        cocktails: special.cocktails,
        food: special.food,
        hh_special_text: special.hh_special_text,
        needs_update_review: true,
    })
    const { location_name, location_image, location_neighborhood, location_address, location_url, start_time, end_time, hh_special_text, monday, tuesday, wednesday, thursday, friday, saturday, sunday, beer, wine, cocktails, food } = formData
    
    // Take datetimes and convert them to XX:XX am/pm format
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC'};
    const startTimeString = startTime.toLocaleTimeString('eng-US', options);
    const endTimeString = endTime.toLocaleTimeString('eng-US', options)
    
    const originalAddress = special.location_address

    // Send the submitted address to GoogleMaps geocoder, set the returned lat and lng in the form
    const geocodeAddress = () => {
        console.log('Geocoding')
        console.log(originalAddress, special.location_address, formData.location_address)
        const address = formData.location_address;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then(data => {
            const latitude = data.results[0].geometry.location.lat;
            const longitude = data.results[0].geometry.location.lng;
            formData.lat = latitude
            formData.lng = longitude
        })
        .catch((error) => {
            console.error("Error:", error);
        });
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

    function patchSpecial() {
        fetch(`https://dhhd-backend.onrender.com/specials/${special.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(formData)
        })
        .then(r => {
            if(r.ok) {
                r.json().then(udpatedSpecial => {
                dispatch(updateSpecial(udpatedSpecial))
                closeModal()
                })
            } else {
                r.json().then(json => setErrors(json.error))
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.location_image === "") {
            formData.location_image = "https://i.pinimg.com/originals/0a/a4/0a/0aa40ab247b227aa9241fac7b28e77fc.jpg"
        }
        if (originalAddress !== formData.location_address) {
            geocodeAddress()
            // Timeout to wait for geocode to complete
            setTimeout(() => { patchSpecial() }, 100)
        }
        patchSpecial()
    }

    return (
        <>
        <Button onClick={() => setOpen(o => !o)}>Edit</Button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <h1>Edit Information</h1>
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
                    <Form.Control type="text" name="location_address" value={location_address} onChange={handleChange} />
                </Form.Group>
                <Form.Group >
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="url" name="location_url" value={location_url} onChange={handleChange} />
                </Form.Group>
                <Form.Group >
                    <Form.Label>Start Time:</Form.Label>
                    <Form.Select required aria-label="Select" name="start_time" value={start_time} onChange={handleChange} >
                        <option value={startTimeString}>{startTimeString}</option>
                        {times.map(time => {
                            return <option key={time} value={time}>{time}</option>})}
                    </Form.Select>
                </Form.Group>
                <Form.Group >
                <Form.Label>End Time:</Form.Label>
                    <Form.Select required aria-label="Select" name="end_time" value={end_time} onChange={handleChange} >
                        <option value={endTimeString}>{endTimeString}</option>
                        {times.map(time => {
                            return <option key={time} value={time}>{time}</option>})}
                    </Form.Select>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Days of the Week</Form.Label>
                    <div>
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Mon' name='monday' defaultChecked={monday} value={monday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Tue' name='tuesday' defaultChecked={tuesday}value={tuesday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Wed' name='wednesday' defaultChecked={wednesday} value={wednesday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Thu' name='thursday' defaultChecked={thursday} value={thursday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Fri' name='friday' defaultChecked={friday} value={friday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Sat' name='saturday' defaultChecked={saturday} value={saturday} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Sun' name='sunday' defaultChecked={sunday} value={sunday} onChange={handleCheckboxChange} />
                    </div>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Types of Specials</Form.Label>
                    <div>
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Beer' name='beer' defaultChecked={beer} value={beer} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Wine' name='wine' defaultChecked={wine} value={wine} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Cocktails' name='cocktails' defaultChecked={cocktails} value={cocktails} onChange={handleCheckboxChange} />
                        <Form.Check inline type="checkbox" id='default-checkbox' label='Food' name='food' defaultChecked={food} value={food} onChange={handleCheckboxChange} />
                    </div>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Happy Hour Specials</Form.Label>
                    <Form.Control as="textarea" rows="3" required name="hh_special_text" value={hh_special_text} onChange={handleChange} />
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


export default SpecialEdit