import Nav from 'react-bootstrap/Nav';

function HorizontalNavBar() {
    return (
        <Nav activeKey="/home">
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="1" disabled>1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="2" disabled>2</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
export default HorizontalNavBar;