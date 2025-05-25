// // src/mocks/handlers.ts
// import { http, HttpResponse } from 'msw';
// import { Listkindergartens } from '../types/kindergartens.type';

// interface IUser {
//   access_token: string;
//   expires_in: number;
//   refresh_token: string;
//   refresh_expires_in: number;
//   token_type: string;
// }
// const user: IUser = {  
//     access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0NXpxQTI1NmFGVVlWdEE2Z3hmQlVSZ09QSUxjWXNuT3J0TnUwMmU1TVIwIn0.eyJleHAiOjE3NDAwNTk5NDcsImlhdCI6MTc0MDA1OTY0NywianRpIjoiOTBmM2RiMzUtYjdlNS00ZDk4LWJhYWUtNjRhMjc0NWY3ZTBkIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL2Zvcmt3YXkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYTRjOTlhZTUtODk0Mi00MDlkLWExMjAtODczZTFmZDYwNzRhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZm9ya3dheS1iYWNrIiwic2lkIjoiZWM1NTFkMTQtZTdjMS00MDAwLWE1NzctOGUzNjIyZGQxMmZlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZm9ya3dheSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.Aug3hDUJlAgFVTFWi67NGxKMKwvXp33py0CkKGr5sya2dvLnHCpnu4u0paq4CiVGIQ7BY7urG7ODpA22n9XeynC8mMCMhR_-PKjYWAqj40HTWssKLsReqflzpekOOhxsI8lOpiHHRIQdurCScF6zw_34HIOAUhnRtgebREXaQjisAc-oT5D_tRAlECpoFrv_s3qIuCQ8tPjr3njo9Iq2ZXYUvnQMLbJe8GsYdvf4dTz5aBURjOAo4h6rd2kp4mzIQvrLUvwjiSAku7Q29xEKlEGpgPhYnmRcCEAQ5QTmo2JMnDxZqmJmR_T0f2SYYJqfbMb8vP2BuSJk1wcQkxv49A",
//     expires_in: 300,
//     refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1YjZlYWNjZC05N2RkLTRiZjUtYjEzNS1jODkwYTMxYzdmMjUifQ.eyJleHAiOjE3NDAwNjE0NDcsImlhdCI6MTc0MDA1OTY0NywianRpIjoiOWQzYzFjZGUtYTUyMi00Y2M4LWIxMWEtY2JhYzU2NTBhMjc2IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL2Zvcmt3YXkiLCJhdWQiOiJodHRwOi8va2V5Y2xvYWs6ODA4MC9yZWFsbXMvZm9ya3dheSIsInN1YiI6ImE0Yzk5YWU1LTg5NDItNDA5ZC1hMTIwLTg3M2UxZmQ2MDc0YSIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJmb3Jrd2F5LWJhY2siLCJzaWQiOiJlYzU1MWQxNC1lN2MxLTQwMDAtYTU3Ny04ZTM2MjJkZDEyZmUiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCB3ZWItb3JpZ2lucyBhY3Igcm9sZXMgc2VydmljZV9hY2NvdW50IGJhc2ljIHByb2ZpbGUifQ.Trzm_f-PID4lo8M1-LWLhDcfHGa2L0CCeDddVP8hbtSlLdyzh9EEdZF8Czfi4FLISdEBYN8_xYvI7sGvCHlRmQ",
//     refresh_expires_in: 1800,
//     token_type: "Bearer"
// };

// const kindergartens: Listkindergartens = {
//   meta: {
//     meta: 1,
//     totalPages: 1
//   },
//   data: [
//     {
//       type: "kindergartens",
//       attributes: {
//         title: "Детский сад №1",
//         address: "ул. Ленина, 1"
//       },
//       id: "1"
//     },
//     {
//       type: "kindergartens",
//       attributes: {
//         title: "Детский сад №2",
//         address: "ул. Пушкина, 2"
//       },
//       id: "2"
//     },
//     {
//       type: "kindergartens",
//       attributes: {
//         title: "Детский сад №3",
//         address: "ул. Гагарина, 3"
//       },
//       id: "3"
//     }
//   ] ,
// }
// export const handlers = [
//   http.post('https://umbreella-dev.ru/api/login', async ({ }) => {
//     // Return mocked user response
//     return new Response(JSON.stringify(user), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }),

//   http.post('https://umbreella-dev.ru/api/logout', async () => {
//     return HttpResponse.json({}, { status: 200 });
//   }),

//   http.get('https://umbreella-dev.ru/api/kindergartens', async () => {
//     return HttpResponse.json({kindergartens}, { status: 200 });
//   })
// ];