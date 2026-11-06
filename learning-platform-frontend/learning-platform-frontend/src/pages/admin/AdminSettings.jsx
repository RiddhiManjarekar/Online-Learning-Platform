
import { useState } from 'react';

import {
    UserRound,
    Lock,
    SlidersHorizontal,
    Tags
} from 'lucide-react';

import AdminProfileForm from '../../components/admin/settings/AdminProfileForm'
import AdminChangePassword from '../../components/admin/settings/AdminChangePassword'
import AdminPlatformSettings from '../../components/admin/settings/AdminPlatformSettings'
import AdminCategories from '../../components/admin/settings/AdminCategories'

const tabs = [
    {
        id: 'profile',
        label: 'Admin Profile',
        icon: UserRound,
        description: 'Manage your name and email address.'
    },
    {
        id: 'password',
        label: 'Change Password',
        icon: Lock,
        description: 'Update your account password securely.'
    },
    {
        id: 'platform',
        label: 'Platform Settings',
        icon: SlidersHorizontal,
        description: 'Manage general platform information.'
    },
    {
        id: 'categories',
        label: 'Course Categories',
        icon: Tags,
        description: 'Create and manage course categories.'
    }
];

function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');

    const currentTab = tabs.find(
        (tab) => tab.id === activeTab
    );

    return (
        <div className="space-y-6">

            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your account and learning platform settings.
                </p>
            </div>

            {/* Settings layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Sidebar tabs */}
                <aside className="lg:col-span-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <nav className="space-y-2">

                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon size={19} />
                                        {tab.label}
                                    </button>
                                );
                            })}

                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <section className="lg:col-span-9">
                    <div className="min-h-[400px] rounded-xl border border-slate-200 bg-white">

                        <div className="border-b border-slate-200 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {currentTab.label}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {currentTab.description}
                            </p>
                        </div>

                        <div className="p-6">
                            {activeTab === 'profile' && <AdminProfileForm />}

                            {activeTab === 'password' && <AdminChangePassword />}

                            {activeTab === 'platform' && <AdminPlatformSettings />}

                            {activeTab === 'categories' && <AdminCategories />}
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

export default AdminSettings;
