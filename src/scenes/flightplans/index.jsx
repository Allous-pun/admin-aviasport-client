import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Backdrop, CircularProgress, Checkbox, FormControlLabel
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

// Dummy Initial Data
const initialDummyData = [
  { id: 1, name: "Flight Alpha", description: "Initial Test Flight", isActive: true },
  { id: 2, name: "Flight Beta", description: "Secondary Run", isActive: false }
];

const FlightPlans = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  useEffect(() => {
    // Simulate fetch delay
    setLoading(true);
    setTimeout(() => {
      setFlights(initialDummyData);
      setLoading(false);
    }, 500);
  }, []);

  const handleOpen = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setFormData(flights[index]);
    } else {
      setEditIndex(null);
      setFormData({
        name: "",
        description: "",
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      if (editIndex !== null) {
        const updated = [...flights];
        updated[editIndex] = { ...formData, id: updated[editIndex].id };
        setFlights(updated);
      } else {
        const newId = flights.length ? Math.max(...flights.map(f => f.id)) + 1 : 1;
        setFlights([...flights, { ...formData, id: newId }]);
      }
      setOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this flight plan?")) {
      setLoading(true);
      setTimeout(() => {
        setFlights(flights.filter(f => f.id !== id));
        setLoading(false);
      }, 500);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Flight Plans
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        Manage Betika Aviator flight plans
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mb: "20px" }}
      >
        Add New Flight
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight, index) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.name}</TableCell>
                <TableCell>{flight.description}</TableCell>
                <TableCell>{flight.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(index)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(flight.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {flights.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No flight plans available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Flight Plan" : "Add New Flight Plan"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default FlightPlans;
