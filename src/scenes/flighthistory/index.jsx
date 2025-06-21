import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, InputAdornment,
  MenuItem, Grid, Card, CardContent, Chip
} from "@mui/material";
import { Search as SearchIcon, Flight as FlightIcon } from "@mui/icons-material";

// Dummy Data
const dummyFlights = [
  {
    id: 1,
    flightNumber: "AV101",
    multiplier: "1.8",
    timestamp: "2025-06-21 10:15:00",
    duration: "30s",
    players: 12,
    startTime: "2025-06-21T10:15:00Z",
    flightPlan: true
  },
  {
    id: 2,
    flightNumber: "AV102",
    multiplier: "2.5",
    timestamp: "2025-06-20 11:00:00",
    duration: "45s",
    players: 18,
    startTime: "2025-06-20T11:00:00Z",
    flightPlan: true
  },
  {
    id: 3,
    flightNumber: "AV103",
    multiplier: "4.3",
    timestamp: "2025-06-18 14:45:00",
    duration: "60s",
    players: 24,
    startTime: "2025-06-18T14:45:00Z",
    flightPlan: true
  },
  {
    id: 4,
    flightNumber: "AV104",
    multiplier: "3.0",
    timestamp: "2025-06-17 16:30:00",
    duration: "40s",
    players: 20,
    startTime: "2025-06-17T16:30:00Z",
    flightPlan: true
  },
  {
    id: 5,
    flightNumber: "AV105",
    multiplier: "1.2",
    timestamp: "2025-06-21 09:00:00",
    duration: "25s",
    players: 10,
    startTime: "2025-06-21T09:00:00Z",
    flightPlan: true
  }
];

const FlightHistory = () => {
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [multiplierFilter, setMultiplierFilter] = useState("all");
  const [stats, setStats] = useState({
    totalFlights: 0,
    averageMultiplier: 0,
    highestMultiplier: 0,
    totalPlayers: 0
  });

  useEffect(() => {
    // Simulate fetching data
    const filtered = dummyFlights.filter(flight => flight.flightPlan);
    setFlights(filtered);
  }, []);

  const getFilteredFlights = useCallback(() => {
    return flights.filter(flight => {
      const matchesSearch = (flight.flightNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = flight.startTime?.startsWith(today);
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        matchesDate = flight.startTime?.startsWith(yesterday);
      } else if (dateFilter === "thisWeek") {
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        matchesDate = flight.startTime >= oneWeekAgo;
      }

      let matchesMultiplier = true;
      const multiplier = parseFloat(flight.multiplier || 0);
      if (multiplierFilter === "low") {
        matchesMultiplier = multiplier < 2.0;
      } else if (multiplierFilter === "medium") {
        matchesMultiplier = multiplier >= 2.0 && multiplier < 4.0;
      } else if (multiplierFilter === "high") {
        matchesMultiplier = multiplier >= 4.0;
      }

      return matchesSearch && matchesDate && matchesMultiplier;
    });
  }, [flights, searchTerm, dateFilter, multiplierFilter]);

  useEffect(() => {
    const filteredFlights = getFilteredFlights();
    const totalFlights = filteredFlights.length;
    const totalMultiplier = filteredFlights.reduce((sum, flight) => sum + parseFloat(flight.multiplier || 0), 0);
    const averageMultiplier = totalFlights > 0 ? (totalMultiplier / totalFlights).toFixed(2) : 0;
    const highestMultiplier = filteredFlights.length > 0 
      ? Math.max(...filteredFlights.map(flight => parseFloat(flight.multiplier || 0)))
      : 0;
    const totalPlayers = filteredFlights.reduce((sum, flight) => sum + (flight.players || 0), 0);
    setStats({
      totalFlights,
      averageMultiplier,
      highestMultiplier,
      totalPlayers
    });
  }, [getFilteredFlights]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleMultiplierFilterChange = (event) => {
    setMultiplierFilter(event.target.value);
  };

  const filteredFlights = getFilteredFlights();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color="#333" fontWeight="bold" sx={{ mb: "5px" }}>
        Flight History
      </Typography>
      <Typography variant="h5" color="#555" sx={{ mb: "20px" }}>
        View historical Betika Aviator flights
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: "Total Flights", value: stats.totalFlights },
          { label: "Avg. Multiplier", value: `${stats.averageMultiplier}x` },
          { label: "Highest Multiplier", value: `${stats.highestMultiplier}x` },
          { label: "Total Players", value: stats.totalPlayers }
        ].map(({ label, value }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card sx={{ bgcolor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">{label}</Typography>
                <Typography variant="h3">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Flight Number"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Date Filter"
            value={dateFilter}
            onChange={handleDateFilterChange}
          >
            <MenuItem value="all">All Dates</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Multiplier Range"
            value={multiplierFilter}
            onChange={handleMultiplierFilterChange}
          >
            <MenuItem value="all">All Multipliers</MenuItem>
            <MenuItem value="low">Low (&lt; 2.0x)</MenuItem>
            <MenuItem value="medium">Medium (2.0x - 4.0x)</MenuItem>
            <MenuItem value="high">High (&gt; 4.0x)</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Flight History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Flight Number</TableCell>
              <TableCell>Multiplier</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Players</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <TableRow key={flight.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FlightIcon sx={{ mr: 1, color: '#666' }} />
                      {flight.flightNumber}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${flight.multiplier}x`} 
                      color={
                        parseFloat(flight.multiplier) < 2.0 ? "default" : 
                        parseFloat(flight.multiplier) < 4.0 ? "primary" : "success"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{flight.timestamp}</TableCell>
                  <TableCell>{flight.duration}</TableCell>
                  <TableCell>{flight.players}</TableCell>
                  <TableCell>
                    <Chip label="Completed" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No flight history found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FlightHistory;
