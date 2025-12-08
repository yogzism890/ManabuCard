# TODO: Fix CRUD Operations and Display

## Completed Tasks
- [x] Add PUT and DELETE routes for koleksi (api/app/api/koleksi/[id]/route.ts)
- [x] Add GET route for all kartu with filtering (api/app/api/kartu/route.ts)
- [x] Add DELETE route for kartu (api/app/api/kartu/[id]/route.ts)
- [x] Add login route (api/app/api/login/route.ts)
- [x] Install required dependencies (bcryptjs, jsonwebtoken)
- [x] Update index.tsx to fetch collections and stats from API
- [x] Update study/[id].tsx to fetch due cards from API
- [x] Create FlipCard component (manabucard/components/FlipCard.tsx)
- [x] Implement profile.tsx with user stats and logout

## Remaining Tasks
- [ ] Test the API routes with real data
- [ ] Run the mobile app and verify CRUD operations work
- [ ] Implement proper authentication (replace MOCK_AUTH_TOKEN with real JWT)
- [ ] Add error handling for network failures in frontend
- [ ] Optimize API calls (e.g., batch fetching stats)

## Notes
- Authentication is currently mocked with MOCK_USER_ID and MOCK_AUTH_TOKEN
- API base URL is hardcoded to http://192.168.100.9:3000/api
- Frontend assumes API responses match expected structure
