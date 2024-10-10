import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Link, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image from '../images/MicrosoftTeams-image.png';
import{ background_image} from '../images/background images.jpeg';
import { BASE_URL } from '../BaseUrl';

// Create a styled component for the login background
const LoginBackground = styled(Box)(({ theme }) => ({
  backgroundImage: `url(https://media.istockphoto.com/id/491817060/vector/abstract-geometric-background-design.jpg?s=612x612&w=0&k=20&c=0Yn8YrNpb8_C9goEwbZis3tc0ybP9bAmKkA_MmxWsGM=)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100%',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on screens smaller than 'md'
  },
}));

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [error, setError] = useState(null);
  const navi = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(
          `${BASE_URL}/login/v1/userLogin`,
          {
            userName: values.username,
            password: values.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          const responseData = response.data;
          console.log(responseData);

          if (responseData.status === 'FAILED') {
            setError('Login FAILED');
          } else {
            sessionStorage.setItem('user', JSON.stringify(responseData));
            setError(null);
            navi('/dashboard');
            formik.resetForm();
          }
        })
        .catch((error) => {
          console.error('Error making API request:', error.message);
          setError(
            error.response?.data?.errorMessage ||
            'An error occurred during login.'
          );
        });
    },
  });

  return (
    <LoginBackground>
      <Container
        maxWidth="lg"
        sx={{ 
          marginTop: "50px", 
          height: '90vh', 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: add a semi-transparent background to the container
          borderRadius: 2, // Optional: add some rounding to the container edges
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            display: 'flex', 
            minHeight: '80%', 
            width: '100%',
            flexDirection: { xs: 'column', md: 'row' }, // Stack items vertically on mobile
          }}
        >
          <Grid container>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <ImageContainer />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 4 }}>
              <Typography variant="h4" gutterBottom>Sign In</Typography>
              <form onSubmit={formik.handleSubmit}>
                <Box mb={2}>
                  <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Box>
                <Box mb={2}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Sign In</Button>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Link href="#" variant="body2">Forgot Password</Link>
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2">
                    Not a member? <Link href="#">Sign Up</Link>
                  </Typography>
                </Box>
                {error && (
                  <Typography color="error" align="center" mt={2}>
                    {error}
                  </Typography>
                )}
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </LoginBackground>
  );
};

export default Login;
