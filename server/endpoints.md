# Hod Hod Endpoints Doc

## /info
Information about app

## /v1/auth/login
```
Data {
  username,
  password
}
```

## /v1/auth/me
```
Data {}
```
### /v1/admin/users/new
```
Data {
 natioanlCode,
 name,
 lastName,
 password
}
```
### /v1/admin/users/list

### /v1/data/cities
```
Data {}
```

### /v1/charter/new

### /v1/charter/list/:page

### /v1/charter/view/:id

### /v1/systemic/new

### /v1/pub/get

### /v1/pub/read/:id