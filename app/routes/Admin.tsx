import { useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router";
import AdminPanel from "../admin/AdminPanel";
import { AdminProvider } from "../Context/AdminContext";

const Admin = () => {
  const { user } = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") nav("/");
  }, [user, nav]);

  return (
    <div>
      <AdminProvider>
        <AdminPanel />
      </AdminProvider>
    </div>
  );
};

export default Admin;
