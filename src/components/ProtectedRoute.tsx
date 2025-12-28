import React from "react";
import { Navigate } from "react-router-dom";
import { authStateStore } from "../store/projectStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute =({children}:ProtectedRouteProps)=>{
    const session =authStateStore(state=>state.session)
    if (!session) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}