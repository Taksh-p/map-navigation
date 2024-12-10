import React, { useRef, useState } from 'react'
import { useEffect } from 'react';

const MapComponent = ({selectedState, selectedDistrict, selectedTaluka}) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [layers, setLayers] = useState(null);

    const updateTheMap = (layerName, filterFieldName, filterValue) => {

        console.log("-------------In Map Components -----------------");
        console.log(`=======================>>>>> ${layerName}`);
        console.log(`=======================>>>>> ${filterFieldName} = "${filterValue}"`);
        
        const layer = new TileLayer({
            source: new TileWMS({
                url: "http://localhost:8080/geoserver/cite/wms",
                params: {
                    "LAYERS": layerName,
                    "TILED": true,
                    "CQL_FILTER": filterValue ? `${filterFieldName} = "${filterValue}`: undefined,
                },
                serverType: "geoserver",
                crossOrigin: "anonymous"
            })
        })
        return layer;
    };

    const newLayers = [];

    useEffect(() => {

        if(!map){
            const initalMap = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new TileWMS({
                            url: "http://localhost:8080/geoserver/cite/wms",
                            params: {
                                "LAYERS": layerName,
                                "TILED": true,
                            },
                            serverType: "geoserver",
                            crossOrigin: "anonymous"
                        }),
                    })
                ],
                view: new View({
                    center: fromLonLat([78.9629, 20.5937]),
                    zoom: 4,
                })
            });
            setMap(initalMap);
            mapRef.current = initalMap;
        }else{

            const newMap = new Map({
                target: 'map',
                layers: layers[0],
                view: new View({
                    center: fromLonLat([78.9629, 20.5937]),
                    zoom: 4,
                })
            });
            setMap(newMap);
            mapRef.current = newMap;
        }

        if(selectedState && !selectedDistrict && !selectedTaluka){
            newLayers.push(updateTheMap('state_boundry_21_03_2023', 'stcode11', selectedState.value));
        }
        if(selectedState && selectedDistrict && !selectedTaluka){
            newLayers.push(updateTheMap('district_boundry_21_03_2023', 'dtcode11', selectedDistrict.value));
        }
        if(selectedState && selectedDistrict && selectedTaluka){
            newLayers.push(updateTheMap('taluka_boundry_21_03_2023', 'name11', selectedTaluka.label));
        }

        if(map){
            map.getLayers().clear();
            newLayers.forEach(layer => {
                map.addLayer(layer);
            })
        }

        return () => {
            if(map){
                map.setTarget(undefined);
            }
        };

    }, [selectedState, selectedDistrict, selectedTaluka]);


  return (
    <div style={{position: 'relative', width: '100%', height: '100vh'}}>
      <div id='map' style={{width: '100%', height: '100%'}}></div>
    </div>
  )
}

export default MapComponent
