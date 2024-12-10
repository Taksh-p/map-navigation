// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";

// const MapNavigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [talukas, setTalukas] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedTaluka, setSelectedTaluka] = useState(null);

//   useEffect(() => {
//     if (isOpen) {
//       fetchStates();
//     }
//   }, [isOpen]);

//   const fetchStates = async () => {
//     try {
//       const response = await axios.get("/api/getStates"); // Replace with your API endpoint
//       setStates(response.data.map((state) => ({ value: state.id, label: state.name })));
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     }
//   };

//   const fetchDistricts = async (stateId) => {
//     try {
//       const response = await axios.get(`/api/getDistricts/${stateId}`); // Replace with your API endpoint
//       setDistricts(response.data.map((district) => ({ value: district.id, label: district.name })));
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//     }
//   };

//   const fetchTalukas = async (districtId) => {
//     try {
//       const response = await axios.get(`/api/getTalukas/${districtId}`); // Replace with your API endpoint
//       setTalukas(response.data.map((taluka) => ({ value: taluka.id, label: taluka.name })));
//     } catch (error) {
//       console.error("Error fetching talukas:", error);
//     }
//   };

//   const handleStateChange = (selectedOption) => {
//     setSelectedState(selectedOption);
//     setSelectedDistrict(null);
//     setSelectedTaluka(null);
//     setDistricts([]);
//     setTalukas([]);
//     if (selectedOption) {
//       fetchDistricts(selectedOption.value);
//     }
//   };

//   const handleDistrictChange = (selectedOption) => {
//     setSelectedDistrict(selectedOption);
//     setSelectedTaluka(null);
//     setTalukas([]);
//     if (selectedOption) {
//       fetchTalukas(selectedOption.value);
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <button
//         style={{
//           position: "absolute",
//           top: 10,
//           right: 10,
//           padding: "10px 15px",
//           margin: "10px",
//           cursor: "pointer",
//         }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         Open Form
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50px",
//             right: "10px",
//             padding: "20px",
//             background: "white",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
//             borderRadius: "5px",
//             width: "300px",
//           }}
//         >
//           <button
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               background: "transparent",
//               border: "none",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//             onClick={() => setIsOpen(false)}
//           >
//             ✖
//           </button>
//           <div style={{ marginBottom: "15px" }}>
//             <label>State:</label>
//             <Select
//               options={states}
//               value={selectedState}
//               onChange={handleStateChange}
//               placeholder="Select State"
//               isClearable
//             />
//           </div>
//           <div style={{ marginBottom: "15px" }}>
//             <label>District:</label>
//             <Select
//               options={districts}
//               value={selectedDistrict}
//               onChange={handleDistrictChange}
//               placeholder="Select District"
//               isDisabled={!selectedState}
//               isClearable
//             />
//           </div>
//           <div>
//             <label>Taluka:</label>
//             <Select
//               options={talukas}
//               value={selectedTaluka}
//               onChange={(selectedOption) => setSelectedTaluka(selectedOption)}
//               placeholder="Select Taluka"
//               isDisabled={!selectedDistrict}
//               isClearable
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapNavigation;


import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Button, IconButton, Box, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigationIcon from "@mui/icons-material/Navigation";
import axios from "axios";
import MapComponent from "./MapComponent";

const MapNavigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [talukas, setTalukas] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTaluka, setSelectedTaluka] = useState(null);

    const BASE_URL = "http://localhost:8080/api/map"

    useEffect(() => {
        if (isOpen) {
            fetchStates();
        }
    }, [isOpen]);

    const fetchStates = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getStates`);
            setStates(response.data.map((state) => ({ 
                value: state.stcode11, label: state.stname 
            })));
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchDistricts = async (stateId) => {
        try {
            const response = await axios.get(`${BASE_URL}/district/${stateId}`);
            setDistricts(response.data.map((district) => ({ value: district.dtcode11, label: district.name11 })));
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchTalukas = async (districtName) => {
        try {
            const response = await axios.get(`${BASE_URL}/taluks/${districtName}`);
            setTalukas(response.data.map((taluka) => ({ value: taluka.gid, label: taluka.name11 })));
        } catch (error) {
            console.error("Error fetching talukas:", error);
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedDistrict(null);
        setSelectedTaluka(null);
        setDistricts([]);
        setTalukas([]);
        if (selectedOption) {
            fetchDistricts(selectedOption.value);
        }
    };

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption);
        setSelectedTaluka(null);
        setTalukas([]);
        if (selectedOption) {
            fetchTalukas(selectedOption.label);
        }
    };

    const customStyle = {
        control: (provided) => ({
            ...provided,
            borderColor: '#ccc',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#aaa'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white': 'black',
            backgroundColor: state.isSelected ? '#007bff': 'white',
            fontSize: '13px',
            '&:hover': {
                backgroundColor: '#007bff',
                color: 'white'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black',
            fontSize: '10px'
        }),
    }

    return (
        <div>

            <MapComponent 
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                selectedTaluka={selectedTaluka}
            />

            <Box sx={{ position: "absolute", top: 20, right: 20, p: 2 }}>
           
           <Button
               variant="contained"
               color="primary"
               startIcon={<NavigationIcon />}
               onClick={() => setIsOpen(!isOpen)}
               sx={{ position: "absolute", top: 10, right: 10 }}
           >
               Navigation
           </Button>

           {isOpen && (
               <Paper
                   elevation={4}
                   sx={{
                       position: "absolute",
                       top: 60,
                       right: 10,
                       width: 320,
                       p: 3,
                       borderRadius: 2,
                   }}
               >
                 
                   <IconButton
                       onClick={() => setIsOpen(false)}
                       sx={{
                           position: "absolute",
                           top: 10,
                           right: 10,
                       }}
                   >
                       <CloseIcon />
                   </IconButton>

                   <Typography variant="h6" sx={{ mb: 2 }}>
                       Select Location
                   </Typography>

                   {/* State Dropdown */}
                   <Box sx={{ mb: 2 }}>
                       <Typography variant="body2" sx={{ mb: 1 }}>
                           State:
                       </Typography>
                       <Select
                           options={states}
                           value={selectedState}
                           onChange={handleStateChange}
                           placeholder="Select State"
                           isClearable
                       />
                   </Box>

                   {/* District Dropdown */}
                   <Box sx={{ mb: 2 }}>
                       <Typography variant="body2" sx={{ mb: 1 }}>
                           District:
                       </Typography>
                       <Select
                           options={districts}
                           value={selectedDistrict}
                           onChange={handleDistrictChange}
                           placeholder="Select District"
                           isDisabled={!selectedState}
                           isClearable
                       />
                   </Box>

                   {/* Taluka Dropdown */}
                   <Box>
                       <Typography variant="body2" sx={{ mb: 1 }}>
                           Taluka:
                       </Typography>
                       <Select
                           options={talukas}
                           value={selectedTaluka}
                           onChange={(selectedOption) => setSelectedTaluka(selectedOption)}
                           placeholder="Select Taluka"
                           isDisabled={!selectedDistrict}
                           isClearable
                       />
                   </Box>
               </Paper>
           )}
       </Box>
        </div>
       
    );
};

export default MapNavigation;


