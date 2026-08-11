import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "./auth/register/Register"
import Layout from "./components/Layout/Layout"
import Login from "./auth/login/Login"
import Profile from "./components/Profile/Profile"
import NotFoundPage from "./components/Notfound/Notfound"
import Home from "./components/Home/Home"
import AuthContextProvider from "./Context/AuthContextProvider"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Notification from "./components/Notification/Notification"
import GuestRoute from "./components/GuestRoute/GuestRoute"
import Suggestion from "./components/Suggestion/Suggestion"
import ProfileContextProvider from "./Context/ProfileContextProvider"
import Setting from "./components/Setting/Setting"
import Feed from "./components/Feed/Feed"
import Community from "./components/Community/Community"
import MyPosts from "./components/MyPosts/MyPosts"
import SavedPosts from "./components/BookmarkedPost/BookmarkedPost"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import PostDetails from "./components/PostDetails/PostDetails"
import { ToastContainer } from "react-toastify"


const queryClient = new QueryClient

function App() {
  let router = createBrowserRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <GuestRoute><Login /></GuestRoute> },
        { path: 'register', element: <GuestRoute><Register /></GuestRoute> },
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: 'profile/:id', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> , children:[
          {index: true , element: <Feed/>},
          {path: 'community' , element: <Community/>},
          {path: 'myposts' , element: <MyPosts/>},
          {path: 'saved' , element: <SavedPosts/>}
        ]},
        { path: 'notifications', element: <ProtectedRoute><Notification /></ProtectedRoute> },
        { path: 'postDetails/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: 'suggestion', element: <ProtectedRoute><Suggestion /></ProtectedRoute> },
        { path: 'settings', element: <ProtectedRoute><Setting /></ProtectedRoute> },
        { path: '*', element: <NotFoundPage /> },
      ]
    }
  ])
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ProfileContextProvider>
            <ToastContainer theme="dark"/>
            <RouterProvider router={router} />
          </ProfileContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
