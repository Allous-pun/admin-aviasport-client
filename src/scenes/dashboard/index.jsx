import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Typography, Alert, Link, Grid, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

const Dashboard = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({
    totalBets: 1200,
    totalPayoutAmount: 250000,
    totalPlayers: 320,
    totalFlights: 85,
    totalPayouts: 600,
    highestWin: 54000
  });

  const [recentBets, setRecentBets] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate login check (remove in actual production)
    // if (!getToken()) {
    //   navigate('/login');
    //   return;
    // }

    // Dummy data setup
    const dummyRecentBets = [
      {
        _id: "1",
        player: { username: "JohnDoe" },
        amount: 500,
        odds: 2.5,
        payout: 1250,
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        player: { username: "JaneSmith" },
        amount: 1000,
        odds: 0,
        payout: 0,
        createdAt: new Date().toISOString()
      },
      {
        _id: "3",
        player: { username: "LuckyPlayer" },
        amount: 200,
        odds: 5,
        payout: 1000,
        createdAt: new Date().toISOString()
      }
    ];

    const dummyTopPlayers = [
      { player: "JohnDoe", totalWins: 12, totalPayout: 14500 },
      { player: "JaneSmith", totalWins: 9, totalPayout: 8800 },
      { player: "LuckyPlayer", totalWins: 15, totalPayout: 21000 }
    ];

    setRecentBets(dummyRecentBets);
    setTopPlayers(dummyTopPlayers);
  }, [navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Betika Aviator Admin Dashboard</Typography>
      
      {/* Navigation Links */}
      <Box mb={3} display="flex" gap={2}>
        <Link href="/bets-history" underline="none">
          <Button variant="contained" color="primary">
            Bets History
          </Button>
        </Link>
        <Link href="/players" underline="none">
          <Button variant="contained" color="primary">
            Players
          </Button>
        </Link>
        <Link href="/payouts" underline="none">
          <Button variant="contained" color="primary">
            Payouts
          </Button>
        </Link>
      </Box>

      {/* Status Alerts */}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Bets</Typography>
            <Typography variant="h4">{stats.totalBets}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Payout</Typography>
            <Typography variant="h4">{formatCurrency(stats.totalPayoutAmount)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Players</Typography>
            <Typography variant="h4">{stats.totalPlayers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Highest Win</Typography>
            <Typography variant="h4">{formatCurrency(stats.highestWin)}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bets Table */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Bets</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Odds</TableCell>
                    <TableCell align="right">Payout</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No recent bets</TableCell>
                    </TableRow>
                  ) : recentBets.map((bet, idx) => (
                    <TableRow key={bet._id || idx}>
                      <TableCell>{bet.player?.username || bet.player || '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(bet.amount)}</TableCell>
                      <TableCell align="right">{bet.odds ? `${bet.odds}x` : '-'}</TableCell>
                      <TableCell align="right" sx={{ 
                        color: bet.payout > 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {bet.payout > 0 ? formatCurrency(bet.payout) : 'Lost'}
                      </TableCell>
                      <TableCell>{bet.createdAt ? new Date(bet.createdAt).toLocaleString() : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Players Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Players</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Total Wins</TableCell>
                    <TableCell align="right">Total Payout</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPlayers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No top players</TableCell>
                    </TableRow>
                  ) : topPlayers.map((player, idx) => (
                    <TableRow key={player.player || idx}>
                      <TableCell>{player.player}</TableCell>
                      <TableCell align="right">{player.totalWins}</TableCell>
                      <TableCell align="right">{formatCurrency(player.totalPayout)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mb={2} gap={2} display="flex">
        <Button 
          variant="contained" 
          onClick={() => setSuccessMessage("New round started successfully")}
        >
          Start New Round
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => setErrorMessage("Round cancelled successfully")}
        >
          Cancel Round
        </Button>
        <Button 
          variant="contained" 
          sx={{
            backgroundColor: '#121212',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#000000',
            }
          }}
          onClick={() => setSuccessMessage("Manual payout processed")}
        >
          Manual Payout
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
