"use client";
import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";

const SensorSunburst = ({ data }) => {
  // Struktur data yang diperlukan oleh nivo sunburst
  const structuredData = {
    name: "All Sensors",
    children: data.reduce((acc, sensor) => {
      // Cek apakah device sudah ada di akumulasi
      let device = acc.find((d) => d.name === sensor.device);
      if (!device) {
        device = { name: sensor.device, children: [] };
        acc.push(device);
      }

      // Tambahkan sensor ke dalam children dari device
      device.children.push({
        name: sensor.sensor,
        value: Number(sensor.lastvalue_raw || 1), // fallback jika kosong
        color:
          sensor.status === "Up"
            ? "green"
            : sensor.status === "Warning"
            ? "orange"
            : "red",
      });

      return acc;
    }, []),
  };

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveSunburst
        data={structuredData}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        identity="name"
        value="value"
        cornerRadius={2}
        borderWidth={1}
        borderColor={{ theme: "background" }}
        colors={{ datum: "data.color" }}
        childColor={{ from: "color" }}
        animate={true}
        motionConfig="gentle"
        isInteractive={true}
        tooltip={({ id, value }) => (
          <div className="bg-gray-800 text-white text-xs p-1 rounded">
            {id}: {value}
          </div>
        )}
      />
    </div>
  );
};

export default SensorSunburst;
