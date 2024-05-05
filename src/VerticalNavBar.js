import Nav from 'react-bootstrap/Nav';

function VerticalNavBar() {
    return (
        <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="/home" disabled>Home</Nav.Link>
            <Nav.Link eventKey="1" disabled>1</Nav.Link>
            <Nav.Link eventKey="2" disabled>2</Nav.Link>
            <Nav.Link eventKey="3" disabled>
                Disabled
            </Nav.Link>
        </Nav>
    );
}
export default VerticalNavBar;