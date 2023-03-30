# Token Generator

## Users

| field      | relation | data type |
| ---------- | -------- | --------- |
| id         |          | number    |
| email      |          | string    |
| password   |          | string    |
| name       |          | string    |
| created_at |          | timestamp |
| updated_at |          | timestamp |
| deleted_at |          | timestamp |

## sessions

| field          | relation               | data type |
| -------------- | ---------------------- | --------- |
| id             |                        | number    |
| user_id        | user has many sessions | number    |
| device_info    |                        | string    |
| token          | UNIQUE                 | string    |
| expires_at     |                        | timestamp |
| last_access_at |                        | timestamp |
| created_at     |                        | timestamp |
| updated_at     |                        | timestamp |
| deleted_at     |                        | timestamp |
