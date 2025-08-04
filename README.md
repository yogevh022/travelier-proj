this project uses mongodb, so an instance of mongodb needs to be running in the background.
if you have mongodb installed, run 'mongod' in the cli (starts the mongo db daemon)

run npm i
npx ts-node src/index.ts
cd into src/frontned
run npm i
npm start

this project implements basic crud for Deals,
using tanstack useQuery,
reusing form component for creation and editing,
endData > startDate validation,
sorting,
debounced search on Deal name,

does NOT implement pagination, filtering, any validation, operator IDs
