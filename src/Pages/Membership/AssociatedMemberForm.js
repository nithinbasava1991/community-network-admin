import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const AssociatedMemberForm = ({
  open,
  handleClose,
  formData,
  setFormData,
  handleChange,
  handleAssociatedMemberSubmit,
 
}) => {
  const [errors, setErrors] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [relationshipName, setRelationshipName] = useState("");
  const initialFormData = {
    fullName: "",
    dob: "",
    bloodGroup: "",
    occupation: "",
    mobileNumber: "",
    emailId: "",
    gender: "",
    qualification: "",
    isAlive: "",
    gothra: "",
    reason: "",
  };
  const validateForm = () => {
    const newErrors = {};
    // Validation logic here...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRelationshipChange = (event) => {
    setRelationshipName(event.target.value);
  };

  const handleAddRelationship = () => {
    if (relationshipName) {
      setRelationships([...relationships, { relationshipName }]);
      setRelationshipName(""); // Clear the selected relationship after adding
    }
  };

  const handleRemoveRelationship = (index) => {
    const updatedRelationships = [...relationships];
    updatedRelationships.splice(index, 1);
    setRelationships(updatedRelationships);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formattedData = {
        associatedMemberships: [
          {
            fullName: formData.fullName,
            dob: formData.dob,
            // age: formData.age,
            bloodGroup: formData.bloodGroup,
            occupation: formData.occupation,
            mobileNumber: formData.mobileNumber,
            // alternativeMobileNumber: formData.alternativeMobileNumber,
            gothra: formData.gothra,
            emailId: formData.emailId,
            gender: formData.gender,
            qualification: formData.qualification,
            isAlive: formData.isAlive,
            // chainStatus: formData.chainStatus,
            reason: formData.reason,
            relationships: relationships.map((relationship) => ({
              relationshipName: relationship.relationshipName,
            })),
          },
        ],
      };
   console.log(formattedData);
      // Call the callback function with the formatted data
      handleAssociatedMemberSubmit(formattedData);
    
      // Clear the form fields and close the dialog
      setFormData(initialFormData);
      setRelationships([]);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Associated Members</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              fullWidth
              error={!!errors.bloodGroup}
              helperText={errors.bloodGroup}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              fullWidth
              error={!!errors.occupation}
              helperText={errors.occupation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="emailId"
              type="email"
              value={formData.emailId}
              onChange={handleChange}
              fullWidth
              error={!!errors.emailId}
              helperText={errors.emailId}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              fullWidth
              error={!!errors.qualification}
              helperText={errors.qualification}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Gothra"
              name="gothra"
              value={formData.gothra}
              onChange={handleChange}
              fullWidth
              error={!!errors.gothra}
              helperText={errors.gothra}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              fullWidth
              error={!!errors.reason}
              helperText={errors.reason}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
              <InputLabel>Is Alive</InputLabel>
              <Select
                name="isAlive"
                value={formData.isAlive}
                onChange={handleChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
              <InputLabel>Relationship</InputLabel>
              <Select
                value={relationshipName}
                onChange={handleRelationshipChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Wife">Wife</MenuItem>
                <MenuItem value="Husband">Husband</MenuItem>
                {/* Add more relationship options as needed */}
              </Select>
            </FormControl>
            <Button onClick={handleAddRelationship} variant="contained">
              Add Relationship
            </Button>
            <br />
            {relationships.map((relationship, index) => (
              <div key={index}>
                <TextField
                  label="Relationship"
                  value={relationship.relationshipName}
                  disabled
                  fullWidth
                />
                <Button
                  onClick={() => handleRemoveRelationship(index)}
                  variant="contained"
                >
                  Remove
                </Button>
              </div>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (validateForm()) {
              handleSubmit();
            }
          }}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssociatedMemberForm;
