import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ItemsTable from './components/ItemsTable';
import ItemForm from './components/ItemForm';
import { getItems, createItem, updateItem, deleteItem } from './api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getItems();
      setItems(data);
    } catch (e) {
      setError('Failed to load items. Ensure backend server and DB are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      await deleteItem(row.id);
      await load();
    } catch (e) {
      setError('Delete failed.');
    }
  };

  const handleSave = async (payload) => {
    if (editing) {
      await updateItem(editing.id, payload);
    } else {
      await createItem(payload);
    }
    await load();
  };

  const headerRight = useMemo(() => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton color="inherit" onClick={load} disabled={loading}>
        <RefreshIcon />
      </IconButton>
      <Button color="inherit" variant="outlined" startIcon={<AddIcon />} onClick={handleCreate}>
        New Item
      </Button>
    </Box>
  ), [loading]);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CRUD RichSite (React + Express + MySQL)
          </Typography>
          {headerRight}
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 3 }}>
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <ItemsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </Container>

      <ItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editing}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        message={error}
      />
    </>
  );
}

export default App;
