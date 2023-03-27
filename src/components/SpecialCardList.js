import { useState } from "react";
import { useSelector } from "react-redux"
import SpecialCard from "./SpecialCard"
import MapAll from "./MapAll";
import CreateNewSpecial from "./CreateNewSpecial";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/esm/Button";

function SpecialCardList({neighborhoods, times}) {
    const specials = useSelector((state) => state.specials);
    const [showMap, setShowMap] = useState(false)
    
    return (
        <>
        <CreateNewSpecial neighborhoods={neighborhoods} times={times} />
        <Button onClick={() => setShowMap(!showMap)}>{showMap ? "Show List" : "Show Map"}</Button>
        {showMap ? 
            <MapAll specials={specials}/> :
            <Container>
                <Row>
                    {specials.map(special => {
                    return <SpecialCard key={special.id} special={special}/>
                    })}
                </Row>
            </Container>
        }
        </>
    )
}

export default SpecialCardList