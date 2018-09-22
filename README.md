# CalDAV Grocery Shoper

CalDAV Food Shopping List lets you easily add new items to your CalDAV shopping list.

Managing your shopping list with a to do list on your CalDAV server is a simple and pragmatic way, especially when using proprietary software to deal with an easy topic such as managing a shopping list is no option for you.

Instead of typing over and over again the items you are going to buy during your weekly shopping trip, add multiple items to your calendar easily by clicking on them.

CalDAV Grocery Shopper assumes you already set up a CalDAV server and created a calendar with "to do" functionality.

## Configuration
- Rename `.env.example` to `.env` and replace the values for your CalDAV configuration appropriately:
  ```
  VUE_APP_DAV_USER=Foo
  VUE_APP_DAV_PASS=Bar
  VUE_APP_DAV_SERVER=https://baz
  VUE_APP_DAV_CALENDAR_NAME=grocerylist
  ```

- Rename the `groceries.example.json` to `groceries.json` and fill it with all the groceries you usually buy:

## Setup and building
```
npm install # Project setup
npm run serve # Compiles and hot-reloads for development
npm run build # Compiles and minifies for production
```

## To do
- [ ] Fixed basket
- [ ] Media Queries
- [x] Filter items by category
- [ ] Batch request for multiple items
- [x] "n times" summary for entry that was added multiple times
- [x] Removable items
