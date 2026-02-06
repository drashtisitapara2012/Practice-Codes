import { getPreferences } from '@/app/actions/preferences';
import SettingsPageContent from '@/components/dashboard/settings-form';

export const metadata = {
    title: 'Settings | NextHub',
    description: 'Customize your dashboard experience',
};

export default async function SettingsPage() {
    const preferences = await getPreferences();

    return <SettingsPageContent initialPreferences={preferences} />;
}
