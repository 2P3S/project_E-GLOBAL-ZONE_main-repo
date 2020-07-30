# e-global-zone

영진전문대학교 글로벌 존 온라인 예약 시스템

## Front-end

### Components

-   Student(Mobile)
    -   Reservation
    -   Schedule
    -   Results

### Commons

-   Mobile
    -   Template
        -   Header
        -   Body
    -   Items
        -   SmallCalendar
            -   Date
        -   List
            -   Item
        -   TabView

### Directory

```
|-- CODES
    |-- .env
    |-- .gitignore
    |-- README.md
    |-- directoryList.md
    |-- package.json
    |-- yarn.lock
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |   |-- logo192.png
    |   |-- logo512.png
    |   |-- manifest.json
    |   |-- robots.txt
    |-- src
        |-- index.js
        |-- app
        |   |-- App.js
        |   |-- Routes.js
        |-- components
        |   |-- common
        |   |   |-- CalendarSmall.js
        |   |   |-- ReservationList.js
        |   |-- mobile
        |   |   |-- Header.js
        |   |   |-- MobileTemplate.js
        |   |-- web
        |-- config
        |   |-- color.js
        |   |-- globalStyles.js
        |   |-- layout.js
        |-- redux
        |   |-- store.js
        |   |-- loginSlice
        |       |-- loginSlice.js
        |-- routes
            |-- Reservation
            |   |-- Reservation.js
            |-- Result
            |   |-- Result.js
            |-- Schedule
                |-- Schedule.js
```
