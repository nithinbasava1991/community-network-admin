import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';

const ForgetPass = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card variant="outlined" sx={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '30px', marginBottom: '20px', display: 'block' }}>Forgot password</span>
            <p style={{ marginBottom: '20px' }}>
              Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
            </p>
            <TextField id="outlined-basic" label="Username or email" variant="outlined" fullWidth />
            <Box mt={2}>
              <Button variant="outlined" fullWidth>
                Reset Password
              </Button><br/><br/>

              <Divider style={{borderBlockStyle:"dotted"}}/>

              <Button><Link to="/">Remember your password?</Link></Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ForgetPass;
