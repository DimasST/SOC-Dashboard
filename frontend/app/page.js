"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [websiteLogs, setWebsiteLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/device_logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    const fetchWebsiteLogs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/website_logs");
        const data = await res.json();
        setWebsiteLogs(data);
      } catch (err) {
        console.error("Failed to fetch website logs:", err);
      }
    };

    fetchLogs();
    fetchWebsiteLogs();
    const interval = setInterval(() => {
      fetchLogs();
      fetchWebsiteLogs();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const allLogs = [...logs, ...websiteLogs];
  const normal = allLogs.filter((log) => log.status === "Up").length;
  const warning = allLogs.filter((log) => log.status === "Warning").length;
  const critical = allLogs.filter((log) => log.status === "Down").length;
  const total = allLogs.length;

  const deviceMap = {};
  allLogs.forEach((log) => {
    if (!deviceMap[log.device]) deviceMap[log.device] = [];
    deviceMap[log.device].push(log);
  });

  const recentLogs = allLogs
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  const deviceData = Object.entries(deviceMap).map(([device, sensors]) => ({
    name: device,
    value: sensors.length,
  }));

  const desktopSensorData = logs.map((sensor) => ({
    name: sensor.sensor,
    value:
      parseFloat(sensor.lastvalue_raw) ||
      parseFloat(sensor.lastvalue) ||
      0,
    unit: sensor.lastvalue?.replace(/[0-9., ]/g, "") || "",
  }));

  const websiteSensorData = websiteLogs.map((sensor) => ({
    name: sensor.sensor,
    value:
      parseFloat(sensor.lastvalue_raw) ||
      parseFloat(sensor.lastvalue) ||
      0,
    unit: sensor.lastvalue?.replace(/[0-9., ]/g, "") || "",
  }));

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF6384"];

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PP Penjaga</h1>
        <button className="text-white text-2xl">☰</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Normal" icon="✅" value={normal} />
        <Card title="Warning" icon="⚠️" value={warning} />
        <Card title="Critical" icon="❌" value={critical} />
        <Card title="Total Sensor" icon="📡" value={total} />
      </div>

      <div className="bg-[#1B263B] p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Sensor Value Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Device Chart */}
          <div className="text-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 font-bold text-sm">Total Device</p>
          </div>

          {/* Desktop Sensor Chart */}
          <div className="text-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={desktopSensorData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {desktopSensorData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const unit =
                      desktopSensorData?.[props?.dataIndex]?.unit || "";
                    return [`${value}${unit}`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 font-bold text-sm">DESKTOP-OT2EVTR</p>
          </div>

          {/* Website Monitor Sensor Chart */}
          <div className="text-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={websiteSensorData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {websiteSensorData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const unit =
                      websiteSensorData?.[props?.dataIndex]?.unit || "";
                    return [`${value}${unit}`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 font-bold text-sm">website monitor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1B263B] p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Device</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-600">
                <th className="py-1">Status</th>
                <th className="py-1">Device</th>
                <th className="py-1">Sensors</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deviceMap).map(([device, sensors]) => (
                <tr key={device}>
                  <td className="py-1 text-green-500">⬤ Up</td>
                  <td className="py-1">{device}</td>
                  <td className="py-1">{sensors.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#1B263B] p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Sensor Detail</h2>
          <div className="flex justify-between text-sm font-bold border-b border-gray-700 pb-1">
            <span>Type</span>
            <span>Last Value</span>
          </div>
          {logs.slice(0, 5).map((sensor, index) => (
            <div
              key={`desktop-${sensor.objid}-${index}`}
              className="flex justify-between text-sm py-1 border-b border-gray-700"
            >
              <span>{sensor.sensor}</span>
              <span>{sensor.lastvalue}</span>
            </div>
          ))}
          {websiteLogs.slice(0, 5).map((sensor, index) => (
            <div
              key={`website-${sensor.objid}-${index}`}
              className="flex justify-between text-sm py-1 border-b border-gray-700"
            >
              <span>{sensor.sensor}</span>
              <span>{sensor.lastvalue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  {/* ALERT - kiri */}
  <div className="bg-[#1B263B] p-4 rounded">
    <h2 className="text-lg font-semibold mb-2 text-red-400">Alert (Sensor Down)</h2>
    <ul className="text-sm list-disc list-inside space-y-1">
      {recentLogs
        .filter((log) => log.status === "Down")
        .map((log, i) => {
          const time = new Date(log.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return (
            <li key={`${log.objid}-alert-${i}`}>
              [{time}] ❌ Sensor <strong>{log.sensor}</strong> di device{" "}
              <strong>{log.device}</strong> status:{" "}
              <strong>{log.status}</strong>, nilai:{" "}
              <strong>{log.lastvalue}</strong>
            </li>
          );
        })}
      {recentLogs.filter((log) => log.status === "Down").length === 0 && (
        <p className="text-gray-400">Tidak ada sensor yang down.</p>
      )}
    </ul>
  </div>

  {/* LOG ACTIVITY - kanan */}
  <div className="bg-[#1B263B] p-4 rounded">
    <h2 className="text-lg font-semibold mb-2">Log Activity (Last Update)</h2>
    <ul className="text-sm list-disc list-inside space-y-1">
      {recentLogs.map((log, i) => {
        const time = new Date(log.timestamp).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const icon =
          log.status === "Down"
            ? "❌"
            : log.status === "Warning"
            ? "⚠️"
            : "✅";

        return (
          <li key={`${log.objid}-log-${i}`}>
            [{time}] {icon} Sensor <strong>{log.sensor}</strong> di device{" "}
            <strong>{log.device}</strong> status:{" "}
            <strong>{log.status}</strong>, nilai:{" "}
            <strong>{log.lastvalue}</strong>
          </li>
        );
      })}
    </ul>
  </div>
</div>

    </div>
  );
}

function Card({ title, icon, value }) {
  return (
    <div className="bg-[#1B263B] p-4 rounded text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-1 font-semibold">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
