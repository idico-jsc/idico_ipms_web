import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface Props extends React.ComponentProps<"div"> {}

export const Home = ({ ...rest }: Props) => {
  const [count, setCount] = useState(0);
  const { t } = useTranslation(["pages", "fields", "buttons"]);
  const { user, isAuthenticated, logout } = useAuth();

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="bg-background text-foreground relative min-h-screen p-8" {...rest}>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* User Profile Section */}
        {isAuthenticated && user ? (
          <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <Button variant="outline" size="sm" onClick={logout}>
                {t("buttons:logout")}
              </Button>
            </div>

            <div className="space-y-4">
              {/* User Avatar and Name */}
              <div className="flex items-center gap-4">
                {user.user_image ? (
                  <img
                    src={user.user_image}
                    alt={user.full_name || user.name}
                    className="border-border h-16 w-16 rounded-full border-2 object-cover"
                  />
                ) : (
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                    {user.full_name?.[0] || user.name[0] || "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{user.full_name || user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="border-border grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Username</p>
                  <p className="font-medium">{user.name}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">User Type</p>
                  <p className="font-medium">{user.user_type || "N/A"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p className="font-medium">
                    <span className={user.enabled ? "text-green-600" : "text-red-600"}>
                      {user.enabled ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                  </p>
                </div>

                {user.roles && user.roles.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-2 text-sm">Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.creation && (
                  <div>
                    <p className="text-muted-foreground text-sm">Account Created</p>
                    <p className="font-medium">{new Date(user.creation).toLocaleDateString()}</p>
                  </div>
                )}

                {user.modified && (
                  <div>
                    <p className="text-muted-foreground text-sm">Last Modified</p>
                    <p className="font-medium">{new Date(user.modified).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Roles */}
                <div className="md:col-span-2">
                  <p className="text-muted-foreground mb-2 text-sm">Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.assigned_sis_roles?.map((role) => (
                      <span
                        key={role}
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border-border rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">
              Not logged in. Please log in to view your profile.
            </p>
          </div>
        )}

        {/* Counter Demo Section */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="mb-4 text-2xl font-bold">Counter Demo</h2>
          <div className="flex items-center gap-4">
            <span className="text-2xl">
              {t("count.label", { ns: "fields" })}: {count}
            </span>
            <Button variant={"secondary"} onClick={handleIncrement}>
              {t("increase", { ns: "buttons" })}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground text-center">
          {t("home.title", { ns: "pages" })} {t("home.author", { ns: "pages" })}
          <a
            href="https://github.com/yeasin2002"
            className="hover:text-foreground mx-2 underline transition-colors"
            target="_blank"
          >
            (yeasin2002)
          </a>
        </p>
      </div>
    </div>
  );
};
