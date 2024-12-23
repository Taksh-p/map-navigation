// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import './App.css';

// // Dummy data for state, district, and taluka
// const states = [
//   { value: 'gujarat', label: 'Gujarat' },
//   { value: 'maharashtra', label: 'Maharashtra' },
// ];

// const districts = {
//   gujarat: [
//     { value: 'ahmedabad', label: 'Ahmedabad' },
//     { value: 'vadodara', label: 'Vadodara' },
//   ],
//   maharashtra: [
//     { value: 'mumbai', label: 'Mumbai' },
//     { value: 'pune', label: 'Pune' },
//   ],
// };

// const talukas = {
//   ahmedabad: [
//     { value: 'gandhinagar', label: 'Gandhinagar' },
//     { value: 'sanand', label: 'Sanand' },
//   ],
//   vadodara: [
//     { value: 'dabhoi', label: 'Dabhoi' },
//     { value: 'karjan', label: 'Karjan' },
//   ],
//   mumbai: [
//     { value: 'andheri', label: 'Andheri' },
//     { value: 'bandra', label: 'Bandra' },
//   ],
//   pune: [
//     { value: 'kothrud', label: 'Kothrud' },
//     { value: 'shivajinagar', label: 'Shivajinagar' },
//   ],
// };

// function App() {
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedTaluka, setSelectedTaluka] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);

//   // Handle changes in state, district, and taluka selection
//   const handleStateChange = (selectedOption) => {
//     setSelectedState(selectedOption);
//     setSelectedDistrict(null);
//     setSelectedTaluka(null);
//   };

//   const handleDistrictChange = (selectedOption) => {
//     setSelectedDistrict(selectedOption);
//     setSelectedTaluka(null);
//   };

//   const handleTalukaChange = (selectedOption) => {
//     setSelectedTaluka(selectedOption);
//   };

//   const handleSave = () => {
//     const newEntry = {
//       id: editIndex !== null ? tableData[editIndex].id : tableData.length + 1,
//       state: selectedState,
//       district: selectedDistrict,
//       taluka: selectedTaluka,
//     };

//     if (editIndex !== null) {
//       const updatedData = [...tableData];
//       updatedData[editIndex] = newEntry;
//       setTableData(updatedData);
//       setEditIndex(null);
//     } else {
//       setTableData([...tableData, newEntry]);
//     }

//     setSelectedState(null);
//     setSelectedDistrict(null);
//     setSelectedTaluka(null);
//   };

//   const handleEdit = (index) => {
//     const entry = tableData[index];
//     setSelectedState(entry.state);
//     setSelectedDistrict(entry.district);
//     setSelectedTaluka(entry.taluka);
//     setEditIndex(index);
//   };

//   return (
//     <div className="App">
//       <h1>State, District, Taluka Form</h1>

//       <form>
//         <div>
//           <label>State:</label>
//           <Select
//             options={states}
//             value={selectedState}
//             onChange={handleStateChange}
//             placeholder="Select State"
//           />
//         </div>

//         <div>
//           <label>District:</label>
//           <Select
//             options={selectedState ? districts[selectedState.value] : []}
//             value={selectedDistrict}
//             onChange={handleDistrictChange}
//             placeholder="Select District"
//             isDisabled={!selectedState}
//           />
//         </div>

//         <div>
//           <label>Taluka:</label>
//           <Select
//             options={selectedDistrict ? talukas[selectedDistrict.value] : []}
//             value={selectedTaluka}
//             onChange={handleTalukaChange}
//             placeholder="Select Taluka"
//             isDisabled={!selectedDistrict}
//           />
//         </div>

//         <button type="button" onClick={handleSave}>
//           Save
//         </button>
//       </form>

//       <h2>Table</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>State</th>
//             <th>District</th>
//             <th>Taluka</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((row, index) => (
//             <tr key={row.id}>
//               <td>{row.id}</td>
//               <td>{row.state.label}</td>
//               <td>{row.district.label}</td>
//               <td>{row.taluka.label}</td>
//               <td>
//                 <button onClick={() => handleEdit(index)}>Edit</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './App.css';

function App() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [tableData, setTableData] = useState([
    {
      id: 1,
      state: { value: 'gujarat', label: 'Gujarat' },
      district: { value: 'surat', label: 'Surat' },
      taluka: { value: 'kamrej', label: 'Kamrej' },
    }, 
    {
      id: 2,
      state: { value: 'gujarat', label: 'Gujarat' },
      district: { value: 'ahmedabad', label: 'Ahmedabad' },
      taluka: { value: 'vastral', label: 'Vastral' },
    },
  
  ]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch states on component mount
  useEffect(() => {
    axios.get('/states')
      .then((response) => {
        const stateOptions = response.data.map((state) => ({
          value: state.id,
          label: state.name,
        }));
        setStates(stateOptions);
      })
      .catch((error) => console.error('Error fetching states:', error));
  }, []);

  // Handle state change
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedDistrict(null);
    setSelectedTaluka(null);
    setDistricts([]);
    setTalukas([]);

    // Fetch districts for the selected state
    if (selectedOption) {
      axios.get(`/districts?stateId=${selectedOption.value}`)
        .then((response) => {
          const districtOptions = response.data.map((district) => ({
            value: district.id,
            label: district.name,
          }));
          setDistricts(districtOptions);
        })
        .catch((error) => console.error('Error fetching districts:', error));
    }
  };

  // Handle district change
  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedTaluka(null);
    setTalukas([]);

    // Fetch talukas for the selected district
    if (selectedOption) {
      axios.get(`/talukas?districtId=${selectedOption.value}`)
        .then((response) => {
          const talukaOptions = response.data.map((taluka) => ({
            value: taluka.id,
            label: taluka.name,
          }));
          setTalukas(talukaOptions);
        })
        .catch((error) => console.error('Error fetching talukas:', error));
    }
  };

  // Handle taluka change
  const handleTalukaChange = (selectedOption) => {
    setSelectedTaluka(selectedOption);
  };

  const handleSave = () => {
    const newEntry = {
      id: editIndex !== null ? tableData[editIndex].id : tableData.length + 1,
      state: selectedState,
      district: selectedDistrict,
      taluka: selectedTaluka,
    };

    if (editIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editIndex] = newEntry;
      setTableData(updatedData);
      setEditIndex(null);
    } else {
      setTableData([...tableData, newEntry]);
    }

    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedTaluka(null);
  };

  const handleEdit = (index) => {
    const entry = tableData[index];
    setSelectedState(entry.state);
    setSelectedDistrict(entry.district);
    setSelectedTaluka(entry.taluka);

    // Fetch districts for the selected state
    axios.get(`/districts?stateId=${entry.state.value}`).then((response) => {
      const districtOptions = response.data.map((district) => ({
        value: district.id,
        label: district.name,
      }));
      setDistricts(districtOptions);
    });

    // Fetch talukas for the selected district
    axios.get(`/talukas?districtId=${entry.district.value}`).then((response) => {
      const talukaOptions = response.data.map((taluka) => ({
        value: taluka.id,
        label: taluka.name,
      }));
      setTalukas(talukaOptions);
    });

    setEditIndex(index);
  };

  return (
    <div className="App">
      <h1>State, District, Taluka Form</h1>

      <form>
        <div>
          <label>State:</label>
          <Select
            options={states}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select State"
          />
        </div>

        <div>
          <label>District:</label>
          <Select
            options={districts}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Select District"
            isDisabled={!selectedState}
          />
        </div>

        <div>
          <label>Taluka:</label>
          <Select
            options={talukas}
            value={selectedTaluka}
            onChange={handleTalukaChange}
            placeholder="Select Taluka"
            isDisabled={!selectedDistrict}
          />
        </div>

        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>

      <h2>Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>State</th>
            <th>District</th>
            <th>Taluka</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        
          {tableData.map((row, index) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.state.label}</td>
              <td>{row.district.label}</td>
              <td>{row.taluka.label}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

