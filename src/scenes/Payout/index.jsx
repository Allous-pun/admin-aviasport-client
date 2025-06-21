import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

import { usePayouts } from "@/hooks/payouts"; // Ensure this returns the correct data shape

const Payout = () => {
  const { payouts } = usePayouts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [selectedPayout, setSelectedPayout] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredPayouts = payouts
    .filter((p) =>
      p.player?.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.method?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
    .filter((p) => (methodFilter === "all" ? true : p.method === methodFilter))
    .filter((p) => {
      if (dateFilter === "today") {
        const today = new Date().toISOString().slice(0, 10);
        return p.createdAt.slice(0, 10) === today;
      }
      if (dateFilter === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        return p.createdAt.slice(0, 10) === yesterday;
      }
      if (dateFilter === "thisWeek") {
        const now = new Date();
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return new Date(p.createdAt) >= weekAgo;
      }
      return true;
    })
    .filter((p) => (showOnlyPending ? p.status === "pending" : true))
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "failed":
        return <CancelIcon color="error" />;
      case "pending":
        return <HourglassBottomIcon color="warning" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayout(null);
  };

  const handleProcessPayout = (id) => {
    console.log("Process payout with ID:", id);
    // Replace this with actual backend logic
  };

  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payouts.filter((p) => p.status === "completed").length;
  const totalPending = payouts.filter((p) => p.status === "pending").length;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Payout Management
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography>Total Payouts</Typography>
              <Typography variant="h6">{payouts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography>Total Amount</Typography>
              <Typography variant="h6">{formatCurrency(totalAmount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Card>
            <CardContent>
              <Typography>Completed</Typography>
              <Typography variant="h6">{totalCompleted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Card>
            <CardContent>
              <Typography>Pending</Typography>
              <Typography variant="h6">{totalPending}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Method</InputLabel>
            <Select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              label="Method"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="bank">Bank</MenuItem>
              <MenuItem value="crypto">Crypto</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2} display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyPending}
                onChange={() => setShowOnlyPending(!showOnlyPending)}
                color="primary"
              />
            }
            label="Only Pending"
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("player")} style={{ cursor: "pointer" }}>
                Player {sortConfig.key === "player" ? (sortConfig.direction === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />) : null}
              </TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                Date {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />) : null}
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>{payout.player?.username || payout.player}</TableCell>
                <TableCell>{formatCurrency(payout.amount)}</TableCell>
                <TableCell>{payout.method}</TableCell>
                <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusIcon(payout.status)} {payout.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleViewDetails(payout)}>View</Button>
                  {payout.status === "pending" && (
                    <Button size="small" color="primary" onClick={() => handleProcessPayout(payout.id)}>
                      Mark as Completed
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Payout Details</DialogTitle>
        <DialogContent>
          {selectedPayout && (
            <>
              <Typography><strong>Player:</strong> {selectedPayout.player?.username || selectedPayout.player}</Typography>
              <Typography><strong>Amount:</strong> {formatCurrency(selectedPayout.amount)}</Typography>
              <Typography><strong>Method:</strong> {selectedPayout.method}</Typography>
              <Typography><strong>Status:</strong> {selectedPayout.status}</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedPayout.createdAt).toLocaleString()}</Typography>
              {selectedPayout.note && (
                <Typography><strong>Note:</strong> {selectedPayout.note}</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payout;
