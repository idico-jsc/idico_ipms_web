/**
 * Settings Page - Mobile-first design
 *
 * Features:
 * - Account profile card with avatar, name, email
 * - Quick access grid to menu items (4 columns)
 * - Settings list (account, language, theme, rating, version)
 * - Logout button
 */

import { useState } from 'react';
import {
  Lock,
  Globe,
  Palette,
  Star,
  Info,
  ChevronRight,
  Home,
  Users,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card } from '@atoms/card';
import { Button } from '@atoms/button';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { LanguageSelector, ThemeSelector } from '@/features/preference';
import { useAuth, ChangePasswordModal } from '@/features/auth';
import { getPath } from '@/features/navigation';
import { cn } from '@/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@atoms/alert-dialog';
import { useTranslation } from 'react-i18next';

interface Props extends React.ComponentProps<'div'> { }

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action?: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
  customContent?: React.ReactNode;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <Home className="h-6 w-6" />,
    path: getPath.home(),
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: <Users className="h-6 w-6" />,
    path: getPath.customers(),
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="h-6 w-6" />,
    path: '/reports',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon className="h-6 w-6" />,
    path: getPath.settings(),
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
  },
];

export const SettingsPage = ({ className, ...rest }: Props) => {
  const { t } = useTranslation(["buttons"])
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(getPath.login());
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'account',
      label: 'Account & Security',
      description: 'Change password and security settings',
      icon: <Lock className="h-5 w-5" />,
      customContent: (
        <ChangePasswordModal>
          <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left">
            <div className="p-2 rounded-lg bg-muted">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Account & Security</p>
              <p className="text-sm text-muted-foreground truncate">
                Change password and security settings
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
          </button>
        </ChangePasswordModal>
      ),
    },
    {
      id: 'language',
      label: 'Language',
      description: 'Choose your preferred language',
      icon: <Globe className="h-5 w-5" />,
      showChevron: false,
      rightContent: (
        <div className="w-45">
          <LanguageSelector />
        </div>
      ),
    },
    {
      id: 'theme',
      label: 'Appearance',
      description: 'Light or dark mode',
      icon: <Palette className="h-5 w-5" />,
      showChevron: false,
      rightContent: (
        <div className="w-45">
          <ThemeSelector />
        </div>
      ),
    },
    {
      id: 'rate',
      label: 'Rate this app',
      description: 'Help us improve',
      icon: <Star className="h-5 w-5" />,
      action: () => {
        // Handle app rating
        console.log('Rate app');
      },
      showChevron: true,
    },
    {
      id: 'version',
      label: 'Version',
      description: 'v1.0.0',
      icon: <Info className="h-5 w-5" />,
      action: () => { },
      showChevron: false,
    },
  ];

  return (
    <div className={cn('min-h-screen bg-background pb-10 md:pb-8', className)} {...rest}>
      <div className="container mx-auto max-w-2xl py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user?.full_name || 'User'}
              imageUrl={user?.user_image}
              size="lg"
              showBorder
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold truncate">{user?.full_name || 'User Name'}</h2>
              <p className="text-xs font-light text-muted-foreground truncate">{user?.name || 'user@example.com'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(getPath.settingsProfile())}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Quick Access Grid */}
        <div className="block md:hidden">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Quick Access</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickAccessItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent transition-colors"
              >
                <div className={cn('p-3 rounded-xl', item.color)}>{item.icon}</div>
                <span className="text-xs text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings List */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Settings</h3>
          <Card className="divide-y">
            {settingsItems.map((item) =>
              item.customContent ? (
                <div key={item.id}>{item.customContent}</div>
              ) : (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="p-2 rounded-lg bg-muted">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  {item.rightContent && <div className="ml-auto">{item.rightContent}</div>}
                  {item.showChevron && <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />}
                </button>
              )
            )}
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full flex md:hidden"
          onClick={() => setShowLogoutDialog(true)}
        >
          {t('sign_out')}
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};
