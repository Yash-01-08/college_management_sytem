import React, { useEffect, useState } from "react";
import { User } from "../../types";
import { getAdminUsers, deleteAdminUser } from "../../services/adminService";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Trash2, Users as UsersIcon, ShieldAlert } from "lucide-react";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers();
      if (res.data) setUsers(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch system users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminUser(deleteTarget.id || (deleteTarget as any)._id);
      setUsers((prev) => prev.filter((u) => (u.id || (u as any)._id) !== (deleteTarget.id || (deleteTarget as any)._id)));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.scholarNumber && u.scholarNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loader message="Loading system users list..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUsers} />;

  const columns = [
    {
      header: "User Details",
      accessor: (u: User) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{u.email}</div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (u: User) => {
        const role = u.role?.toLowerCase();
        let variant: "indigo" | "emerald" | "cyan" | "rose" = "indigo";
        if (role === "admin") variant = "rose";
        if (role === "student") variant = "emerald";
        if (role === "faculty") variant = "cyan";
        return <Badge variant={variant}>{u.role?.toUpperCase()}</Badge>;
      },
    },
    {
      header: "Department / Info",
      accessor: (u: User) => u.department || u.scholarNumber || u.employeeId || "—",
    },
    {
      header: "Actions",
      accessor: (u: User) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeleteTarget(u)}
          icon={Trash2}
          disabled={u.role?.toLowerCase() === "admin"}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-indigo-500" />
            <span>User Accounts Directory</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            System administration for Students, Faculty, Coordinators, and Admins.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or scholar #..." className="w-full sm:w-72" />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Users Found"
          description="No user accounts match your current filter criteria."
        />
      ) : (
        <Table columns={columns} data={filteredUsers} />
      )}

      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete User Account"
          message={`Are you sure you want to permanently remove ${deleteTarget.name}? This operation cannot be reversed.`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default UsersPage;
