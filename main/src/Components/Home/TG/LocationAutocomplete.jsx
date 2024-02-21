import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const LocationAutocomplete = ({ value, onChange, options }) => {
    return (
        <Autocomplete
            value={value}
            onChange={onChange}
            options={options}
            getOptionLabel={(option) => option.label || ''}
            freeSolo={false}
            autoHighlight
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select or Type Location"
                    margin="normal"
                />
            )}
            style={{ marginBottom: "1rem" }}
        />
    );
};

export default LocationAutocomplete;
