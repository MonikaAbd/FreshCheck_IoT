import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Collapse,
  ButtonGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { getSensorData } from "../services/sensorDataService.js";

const RANGES = [
  { label: "1h", value: "1h" },
  { label: "6h", value: "6h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "Vše", value: "all" },
];
function parseTimestamp(ts) {
  const d = new Date(ts);
  d.setHours(d.getHours() + 1); //  +1 hour to temporarily fix timezone issue in CZ
  return d;
}

function formatTime(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}.${month}\n${hours}:${minutes}`;
}

export default function DeviceCharts({ deviceId }) {
  const { token } = useAuth();
  const [rawData, setRawData] = useState([]);
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  const sorted = [...rawData].sort((a, b) => a.timestamp - b.timestamp);
  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getSensorData(deviceId, token);
        if (cancelled) return;

        setRawData(
          data.map((it) => ({
            timestamp: parseTimestamp(it.timestamp),
            temperature: it.temperature != null ? Number(it.temperature) : null,
            humidity: it.humidity != null ? Number(it.humidity) : null,
          }))
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Chyba při načítání dat"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [deviceId, token]);

  const filteredData = useMemo(() => {
    if (range === "all") {
      return sorted.map((d) => ({
        ...d,
        time: formatTime(d.timestamp),
      }));
    }

    const now = Date.now();
    const diffMap = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    };

    const from = now - diffMap[range];

    return sorted
      .filter((d) => d.timestamp.getTime() >= from)
      .map((d) => ({
        ...d,
        time: formatTime(d.timestamp),
      }));
  }, [sorted, range]);

  const toggle = () => setExpanded((v) => !v);

  // dynamické nastavení intervalu popisků na ose X podle hustoty dat
  const tickInterval =
    filteredData.length > 30 ? Math.ceil(filteredData.length / 10) : 0;

  return (
    <Box p={3} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Grafy (teplota / vlhkost)</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={toggle}
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {expanded ? "Skrýt" : "Zobrazit"}
        </Button>
      </Box>

      {/* 🔹 výběr rozsahu */}
      <ButtonGroup size="small" sx={{ mt: 1 }}>
        {RANGES.map((r) => (
          <Button
            key={r.value}
            variant={range === r.value ? "contained" : "outlined"}
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </Button>
        ))}
      </ButtonGroup>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Collapse in={expanded}>
        {filteredData.length > 0 ? (
          <Box sx={{ width: "100%", height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  interval={tickInterval}
                  tick={{ fontSize: 12 }}
                  height={50}
                />
                <YAxis
                  yAxisId="left"
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${v}°`}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="linear"
                  dataKey="temperature"
                  name="Teplota (°C)"
                  stroke="#ff5722"
                  dot={true}
                  connectNulls={true}
                />
                <Line
                  yAxisId="right"
                  type="linear"
                  dataKey="humidity"
                  name="Vlhkost (%)"
                  stroke="#2196f3"
                  dot={true}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          !loading && (
            <Typography sx={{ mt: 2 }}>
              Žádná data v tomto časovém rozsahu.
            </Typography>
          )
        )}
      </Collapse>
    </Box>
  );
}
