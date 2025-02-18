import { InputGroup, Form } from 'react-bootstrap';

function SearchBar({ search, setSearch }) {
    return (
        <InputGroup className="mb-3" style={{ width: '30%' }}>
            <InputGroup.Text>
                <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </InputGroup>
    );
}

export default SearchBar;
