# Datový model pro IoT domácí systém

Tento dokument obsahuje návrh datového modelu pro IoT systém chytré domácnosti.

## Kolekce a jejich schémata

### 1. `users`
```json
{
  "_id": "ObjectId",
  "email": "string",
  "name": "string",
  "passwordHash": "string",
  "createdAt": "Date"
}
```

### 2. `devices`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "type": "string", // například: light, thermostat, plug, sensor
  "location": "string", // např. "kuchyn", "loznice"
  "ownerId": "ObjectId", // reference na users
  "createdAt": "Date"
}
```

### 3. `alerts`
```json
{
  "_id": "ObjectId",
  "deviceId": "ObjectId", // reference na devices
  "timestamp": "Date",
  "value": "mixed" // např. teplota, stav zap/vyp, vlhkost, spotřeba
}
```

### 4. `sensorData`
```json
{
  "_id": "ObjectId",
  "deviceId": "ObjectId",   // reference na devices
  "temperature": "number",
  "humidity": "number",
  "doorState": "boolean",
  "acc": {                  // volitelné, pokud zařízení má akcelerometr
    "x": "number",
    "y": "number",
    "z": "number"
  },
  "timestamp": "Date"
}

```

## Vztahy
- **user → devices**: 1:N
- **device → logs**: 1:N
- **user → sensorData**: 1:N

## Poznámky k implementaci
- Hesla musí být hashována (bcrypt).
- Logy mohou být ukládány ve vysoké frekvenci → možné využít TTL index pro auto-expiraci.
- Automatizace mohou běžet v samostatné službě (worker), která pravidelně kontroluje podmínky.

