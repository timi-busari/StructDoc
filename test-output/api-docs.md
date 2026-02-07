# API Documentation

Auto-generated API documentation from NestJS codebase.

*Generated on: 2/7/2026, 9:47:06 AM*

## Table of Contents

- [UserController](#usercontroller)
  - [GET /users](#get--users)
  - [POST /users](#post--users)
  - [GET /users/:id](#get--users--id)
- [WalletController](#walletcontroller)
  - [GET /wallet](#get--wallet)
  - [GET /wallet/:id](#get--wallet--id)
  - [POST /wallet/create](#post--wallet-create)
  - [POST /wallet/transfer](#post--wallet-transfer)

## UserController

### GET /users

---

### POST /users

**Authentication:** Required (Bearer Token)

---

### GET /users/:id

**Parameters:**

- **id** (path): string

---

## WalletController

### GET /wallet

**Authentication:** Required (Bearer Token)

**Parameters:**

- **page** (query): number

---

### GET /wallet/:id

**Authentication:** Required (Bearer Token)

**Parameters:**

- **id** (path): string

---

### POST /wallet/create

**Authentication:** Required (Bearer Token)

---

### POST /wallet/transfer

**Authentication:** Required (Bearer Token)

---

## Schemas

### UserResponse

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "email",
    "name"
  ]
}
```

### CreateUserDto

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "email",
    "name"
  ]
}
```

### WalletResponse

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "amount": {
      "type": "number"
    },
    "currency": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "amount",
    "currency"
  ]
}
```

### CreateWalletDto

```json
{
  "type": "object",
  "properties": {
    "amount": {
      "type": "number"
    },
    "currency": {
      "type": "string"
    }
  },
  "required": [
    "amount",
    "currency"
  ]
}
```

### TransferDto

```json
{
  "type": "object",
  "properties": {
    "amount": {
      "type": "number"
    },
    "toUserId": {
      "type": "string"
    }
  },
  "required": [
    "amount",
    "toUserId"
  ]
}
```

### UserResponseArray

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/UserResponse"
  }
}
```

### WalletResponseArray

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/WalletResponse"
  }
}
```

### WalletController_transfer_Response

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    }
  },
  "required": [
    "success"
  ]
}
```
