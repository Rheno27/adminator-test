import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Table, Form, InputGroup, Pagination, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { toast } from 'react-toastify';
import { getPosts, 
  createPost as createPostService 
} from '../../services/posts';
import PaginationComponent from '../../components/pagination';
import SearchBar from '../../components/SearchBar';

export const Route = createLazyFileRoute('/public/posts')({
  component: PostsTable,
});

function PostsTable() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate({to: '/login'});
    }
  }, [navigate]);

  const { data: postsList, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await getPosts();
      return response;
    },
  });
  
  const { mutate: createPost } = useMutation({
    mutationFn: createPostService,
    onSuccess: () => {
        toast.success('Post created successfully');
        handleClose();
        setFormData({ title: '', body: '' });
    },
    onError: (error) => {
        toast.error(error.message || 'Failed to create post');
    },
  });

  const sortedPosts = Array.isArray(postsList) ? [...postsList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  const filteredPosts = sortedPosts.filter((post) =>
    post.id.toString().includes(search) ||
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  );

    // Hitung total halaman berdasarkan itemsPerPage yang dipilih
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    // Hitung indeks awal dan akhir data yang akan ditampilkan
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); 
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      toast.error("User ID tidak ditemukan. Silakan login kembali.");
      return;
    }
    const newPost = {
      title: formData.title,
      body: formData.body,
      user_id: user.id,
    };
    createPost(newPost);
    console.log(newPost);
  };
  

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={2} className="p-0">
            <Sidebar />
        </Col>
        <Col md={10} className="p-0 px-3">
          <AppNavbar />
            <div className="d-flex justify-content-between align-items-center">
                <h3>Posts List</h3>
                <Button variant="primary" onClick={handleShow}>Create Post</Button>
            </div>
          <SearchBar search={search} setSearch={setSearch} />
          <Table striped bordered hover responsive>
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationComponent 
            currentPage={currentPage} 
            totalPages={totalPages} 
            itemsPerPage={itemsPerPage} 
            onPageChange={setCurrentPage} 
            onItemsPerPageChange={handleItemsPerPageChange} 
          />
        </Col>
      </Row>
      </Container>
       {/* Modal Form */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                name="body"
                rows={3}
                value={formData.body}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
