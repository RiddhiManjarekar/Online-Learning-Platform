import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Users,
  RefreshCw,
  ShieldCheck,
  UserRound,
  GraduationCap,
  UserCheck,
  UserX,
} from "lucide-react";

import adminService from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";

const roles = ["LEARNER", "INSTRUCTOR", "ADMIN"];

function AdminUsers() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});

  const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

  // Fetch users using the current search and role filters
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminUsers", debouncedSearch, roleFilter],
    queryFn: () =>
      adminService.getUsers({
        search: debouncedSearch,
        role: roleFilter,
      }),
  });

  // Update a user's role
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminService.updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminDashboardStats"],
      });
    },
  });

  // Activate or deactivate a user
  const statusMutation = useMutation({
    mutationFn: ({ id, enabled }) => adminService.updateUserStatus(id, enabled),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });

  function handleRoleChange(userId, newRole) {
    setSelectedRoles((previous) => ({
      ...previous,
      [userId]: newRole,
    }));
  }

  function handleRoleUpdate(user) {
    const newRole = selectedRoles[user.id];

    if (!newRole || newRole === user.role) {
      return;
    }

    if (newRole === "ADMIN") {
      const confirmed = window.confirm(
        `Are you sure you want to give ${user.name} administrator access?`,
      );

      if (!confirmed) {
        return;
      }
    }

    roleMutation.mutate(
      { id: user.id, role: newRole },
      {
        onSuccess: () => {
          setSelectedRoles((previous) => {
            const updated = { ...previous };
            delete updated[user.id];
            return updated;
          });
        },
      },
    );
  }

  function handleStatusChange(user) {
    const action = user.enabled ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    statusMutation.mutate({
      id: user.id,
      enabled: !user.enabled,
    });
  }

  const totalUsers = users.length;
  const learners = users.filter((item) => item.role === "LEARNER").length;
  const instructors = users.filter((item) => item.role === "INSTRUCTOR").length;
  const admins = users.filter((item) => item.role === "ADMIN").length;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all registered users.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryCard title="Total Users" value={totalUsers} icon={Users} />
        <SummaryCard title="Learners" value={learners} icon={GraduationCap} />
        <SummaryCard title="Instructors" value={instructors} icon={UserRound} />
        <SummaryCard title="Admins" value={admins} icon={ShieldCheck} />
      </div>

      {/* Search and filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="LEARNER">Learners</option>
            <option value="INSTRUCTOR">Instructors</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* API errors */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.response?.data?.message ||
            "Unable to load users. Please try again."}
        </div>
      )}

      {roleMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {roleMutation.error?.response?.data?.message ||
            "Unable to update user role."}
        </div>
      )}

      {statusMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {statusMutation.error?.response?.data?.message ||
            "Unable to update account status."}
        </div>
      )}

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Registered Users</h2>
          <p className="mt-1 text-xs text-gray-500">
            {totalUsers} user(s) found
          </p>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Users could not be displayed.
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="font-medium text-gray-700">No users found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Change Role</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((item) => {
                  const isCurrentUser = item.email === currentUser?.email;

                  const selectedRole = selectedRoles[item.id] || item.role;

                  const roleChanged = selectedRole !== item.role;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {item.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-indigo-600">
                              You
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <RoleBadge role={item.role} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge enabled={item.enabled} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRole}
                            disabled={
                              isCurrentUser ||
                              !item.enabled ||
                              roleMutation.isPending
                            }
                            onChange={(event) =>
                              handleRoleChange(item.id, event.target.value)
                            }
                            className="rounded-md border border-gray-300 px-2 py-2 text-xs disabled:bg-gray-100"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleRoleUpdate(item)}
                            disabled={
                              !roleChanged ||
                              isCurrentUser ||
                              !item.enabled ||
                              roleMutation.isPending
                            }
                            className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Save
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStatusChange(item)}
                          disabled={isCurrentUser || statusMutation.isPending}
                          className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                            item.enabled
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {item.enabled ? (
                            <>
                              <UserX size={14} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} />
                              Activate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={19} className="text-indigo-600" />
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    LEARNER: "bg-blue-50 text-blue-700",
    INSTRUCTOR: "bg-purple-50 text-purple-700",
    ADMIN: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[role] || "bg-gray-100 text-gray-700"}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ enabled }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        enabled ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {enabled ? "Active" : "Inactive"}
    </span>
  );
}

export default AdminUsers;
