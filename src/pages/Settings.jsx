import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { LogOut, Moon, Save, Sun, Trash2 } from "lucide-react";
import { auth, db } from "@/services/firebase.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { signOut } from "@/services/auth.js";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";

export default function Settings() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (profile?.displayName) setDisplayName(profile.displayName);
    else if (user?.displayName) setDisplayName(user.displayName);
  }, [profile, user]);

  async function save(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { displayName: displayName.trim() });
      toast.success("Profile updated.");
    } catch {
      toast.error("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  async function handleDeleteAccount() {
    try {
      await deleteUser(auth.currentUser);
      toast.success("Account deleted.");
      navigate("/", { replace: true });
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        toast.error("Please sign in again, then delete.");
      } else {
        toast.error("Could not delete account.");
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Your account</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Settings
      </h1>

      <form onSubmit={save} className="card mt-6 space-y-4 p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Profile</h2>
        <div>
          <label htmlFor="set-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Display name
          </label>
          <input
            id="set-name"
            className="input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
          />
        </div>
        <div>
          <p className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <section className="card mt-4 p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Current theme: <strong>{theme}</strong>
        </p>
        <button onClick={toggleTheme} className="btn-secondary mt-3">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          Switch to {theme === "dark" ? "light" : "dark"} mode
        </button>
      </section>

      <section className="card mt-4 p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Session</h2>
        <button onClick={handleSignOut} className="btn-secondary mt-3">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>

      <section className="card mt-4 border-danger-500/30 p-6">
        <h2 className="font-display text-lg font-bold text-danger-600">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Permanently delete your account. Your decks and cards will be orphaned but the auth record is removed.
        </p>
        <button
          onClick={() => setConfirmDelete(true)}
          className="btn-secondary mt-3 !text-danger-600"
        >
          <Trash2 className="h-4 w-4" /> Delete account
        </button>
      </section>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        description="This cannot be undone. You may be asked to sign in again to confirm."
        confirmText="Delete account"
      />
    </div>
  );
}
