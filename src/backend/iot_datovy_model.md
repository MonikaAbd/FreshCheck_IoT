# Datový model pro IoT domácí systém

Tento dokument obsahuje návrh datového modelu pro IoT systém chytré domácnosti.

## Kolekce a jejich schémata

### 1. `users`
```json
{
  "_id": "ObjectId",
  "email": "string",
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

### 3. `logs`
```json
{
  "_id": "ObjectId",
  "deviceId": "ObjectId", // reference na devices
  "timestamp": "Date",
  "value": "mixed" // např. teplota, stav zap/vyp, vlhkost, spotřeba
}
```

### 4. `automations`
```json
{
  "_id": "ObjectId",
  "ownerId": "ObjectId",
  "name": "string",
  "trigger": {
    "type": "string", // e.g. "deviceValue", "time"
    "deviceId": "ObjectId",
    "condition": "string" // např. value > 25
  },
  "action": {
    "deviceId": "ObjectId",
    "command": "string" // např. "turnOn", "setTemp:22"
  }
}
```

## Vztahy
- **user → devices**: 1:N
- **device → logs**: 1:N
- **user → automations**: 1:N

## Poznámky k implementaci
- Hesla musí být hashována (bcrypt).
- Logy mohou být ukládány ve vysoké frekvenci → možné využít TTL index pro auto-expiraci.
- Automatizace mohou běžet v samostatné službě (worker), která pravidelně kontroluje podmínky.

