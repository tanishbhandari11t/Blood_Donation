import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import './GlobalMap.css';

// Using a reliable TopoJSON with standard country names
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// User-provided & expanded WHO 2024-2025 data
const bloodData = [
    { id: "DNK", name: "Denmark", rate: 61 },
    { id: "AUT", name: "Austria", rate: 50 },
    { id: "DEU", name: "Germany", rate: 56.8 },
    { id: "USA", name: "United States of America", rate: 31.5 }, // TopoJSON often uses this full name
    { id: "GBR", name: "United Kingdom", rate: 31.0 },
    { id: "CAN", name: "Canada", rate: 29.5 },
    { id: "FRA", name: "France", rate: 24.3 },
    { id: "ITA", name: "Italy", rate: 22.8 },
    { id: "BRA", name: "Brazil", rate: 16.0 },
    { id: "CHN", name: "China", rate: 16.4 },
    { id: "ARG", name: "Argentina", rate: 14.5 },
    { id: "IND", name: "India", rate: 12.4 },
    { id: "ZAF", name: "South Africa", rate: 8.0 },
    { id: "IDN", name: "Indonesia", rate: 7.2 },
    { id: "NGA", name: "Nigeria", rate: 5.0 },
    { id: "PAK", name: "Pakistan", rate: 4.8 },
    { id: "ETH", name: "Ethiopia", rate: 3.5 },
];

// Darkest Red >30, Bright 15-30, Light 7-15, Pale Pink <7
const colorScale = scaleLinear()
    .domain([0, 7, 15, 30, 65])
    .range(["#ffe5e5", "#ff9999", "#ff4d4d", "#e60000", "#800000"]);

export default function GlobalMap() {
    const [tooltipContent, setTooltipContent] = useState("");

    return (
        <section className="global-map-section" id="stats">
            <div className="global-map-header">
                <h2 className="global-map-title">Global Blood Donation Map</h2>
                <p className="global-map-desc">
                    Donation Rates per 1000 people (WHO Trends 2024-2025). <br />
                    Hover over countries to see their exact statistics.
                </p>
            </div>

            <div className="global-map-wrapper">
                <div className="global-map-container">
                    <ComposableMap
                        projectionConfig={{ scale: 140 }}
                        width={800}
                        height={400}
                        style={{ width: "100%", height: "auto" }}
                    >
                        <Sphere stroke="#2d2d42" strokeWidth={0.5} />
                        <Graticule stroke="#2d2d42" strokeWidth={0.5} />
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    // Match by name or alternative names
                                    const d = bloodData.find(
                                        (s) => s.name === geo.properties.name || s.id === geo.id
                                    );

                                    // Default fill for countries without data
                                    const fill = d ? colorScale(d.rate) : "#2d2d42";

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={fill}
                                            stroke="#1a1a2e"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none", transition: "all 0.3s ease" },
                                                hover: {
                                                    outline: "none",
                                                    fill: d ? "#ffcccc" : "#3d3d5c",
                                                    cursor: "pointer",
                                                    transform: "scale(1.01)",
                                                    transformOrigin: "center",
                                                    stroke: "#fff",
                                                    strokeWidth: 1
                                                },
                                                pressed: { outline: "none" }
                                            }}
                                            onMouseEnter={() => {
                                                if (d) {
                                                    setTooltipContent(`${d.name}: ${d.rate} donors/1000`);
                                                } else {
                                                    setTooltipContent(`${geo.properties.name}: No data available`);
                                                }
                                            }}
                                            onMouseLeave={() => setTooltipContent("")}
                                            data-tooltip-id="map-tooltip"
                                            data-tooltip-content={tooltipContent}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>

                <Tooltip id="map-tooltip" className="custom-tooltip" place="top" effect="solid" float />

                {/* Legend positioned at bottom left of the map container conceptually */}
                <div className="global-map-legend">
                    <h4 className="legend-title">Donation Rate</h4>
                    <span className="legend-subtitle">(per 1000 people)</span>
                    <div className="legend-scale">
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: "#800000" }}></span>
                            <span>High (&gt;30)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: "#e60000" }}></span>
                            <span>Med-High (15-30)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: "#ff4d4d" }}></span>
                            <span>Med-Low (7-15)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: "#ff9999" }}></span>
                            <span>Low (&lt;7)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: "#2d2d42" }}></span>
                            <span>No Data</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
