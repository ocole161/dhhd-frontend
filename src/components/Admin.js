import { useState } from "react";
import { useSelector } from "react-redux"
import SpecialCardReview from "./SpecialCardReview";
import SpecialCardDelete from "./SpecialCardDelete";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

function Admin() {
    const specials = useSelector((state) => state.specials);
    const newSpecials = specials.filter(special => special.needs_create_review)
    const updatedSpecials = specials.filter(special => special.needs_update_review)
    const deleteRequests = specials.filter(special => special.needs_delete_review)
    
    const [show, setShow] = useState("showNew");

    return (
        <>
        <Button onClick={() => setShow("showNew")}>New Submissions</Button>
        <Button onClick={() => setShow("showChanges")}>Changes</Button>
        <Button onClick={() => setShow("showDeleted")}>Delete Requests</Button>

                {(show === "showNew") ? 
                    <Container>
                        <Row>
                            {newSpecials.map(special => {
                                return <SpecialCardReview key={special.id} special={special} />
                            })}
                        </Row>
                    </Container>
                    : null 
                }

                {(show === "showChanges") ? 
                    <Container>
                        <Row>
                            {updatedSpecials.map(special => {
                                return <SpecialCardReview key={special.id} special={special} />
                            })}
                        </Row>
                    </Container>
                    : null 
                }
                
                {(show === "showDeleted") ? 
                    <Container>
                        <Row>
                            {deleteRequests.map(special => {
                                return <SpecialCardDelete key={special.id} special={special} />
                            })}
                        </Row>
                    </Container>
                    : null 
                }
        </>
    )
}

export default Admin