"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, X, Crown, Edit, Eye, Trash2 } from "lucide-react";

interface Collaborator {
  id: string;
  userId: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface CollaboratorsSectionProps {
  roomId: string;
  currentUserId: string;
}

export function CollaboratorsSection({
  roomId,
  currentUserId,
}: CollaboratorsSectionProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"VIEWER" | "EDITOR">("VIEWER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentUserMembership = collaborators.find(
    (c) => c.userId === currentUserId
  );
  const isOwner = currentUserMembership?.role === "OWNER";

  // Fetch collaborators
  useEffect(() => {
    fetchCollaborators();
  }, [roomId]);

  const fetchCollaborators = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/rooms/${roomId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (res.ok) {
        const newCollaborator = await res.json();
        setCollaborators([...collaborators, newCollaborator]);
        setSuccess(`Successfully added ${inviteEmail}`);
        setInviteEmail("");
        setInviteRole("VIEWER");
        setTimeout(() => {
          setIsInviteModalOpen(false);
          setSuccess(null);
        }, 1500);
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to add collaborator");
      }
    } catch (error) {
      setError("Failed to add collaborator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(
        `/api/rooms/${roomId}/collaborators/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setCollaborators(
          collaborators.map((c) => (c.userId === userId ? updated : c))
        );
      } else {
        const errorText = await res.text();
        alert(errorText || "Failed to update role");
      }
    } catch (error) {
      alert("Failed to update role");
    }
  };

  const handleRemove = async (userId: string, userName: string | null) => {
    if (
      !confirm(
        `Are you sure you want to remove ${userName || "this user"}?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/rooms/${roomId}/collaborators/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCollaborators(collaborators.filter((c) => c.userId !== userId));
      } else {
        const errorText = await res.text();
        alert(errorText || "Failed to remove collaborator");
      }
    } catch (error) {
      alert("Failed to remove collaborator");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "EDITOR":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "VIEWER":
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-yellow-100 text-yellow-800";
      case "EDITOR":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Collaborators</h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {collaborators.length}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </button>
        )}
      </div>

      {/* Collaborators List */}
      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {collaborator.user.name?.[0]?.toUpperCase() ||
                  collaborator.user.email[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {collaborator.user.name || "Unknown"}
                  {collaborator.userId === currentUserId && (
                    <span className="ml-2 text-xs text-gray-500">(You)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {collaborator.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Badge/Selector */}
              {isOwner && collaborator.userId !== currentUserId ? (
                <select
                  value={collaborator.role}
                  onChange={(e) =>
                    handleRoleChange(collaborator.userId, e.target.value)
                  }
                  className="px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="OWNER">Owner</option>
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              ) : (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                    collaborator.role
                  )}`}
                >
                  {getRoleIcon(collaborator.role)}
                  {collaborator.role}
                </div>
              )}

              {/* Remove Button */}
              {(isOwner || collaborator.userId === currentUserId) && (
                <button
                  onClick={() =>
                    handleRemove(collaborator.userId, collaborator.user.name)
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Invite Collaborator
              </h3>
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="colleague@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as "VIEWER" | "EDITOR")
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="VIEWER">Viewer (Read-only)</option>
                  <option value="EDITOR">Editor (Can add/edit items)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Viewers can only view items. Editors can add and edit items.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Inviting..." : "Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}