'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconSettings,
  IconUser,
  IconBrandGithub,
  IconBell,
  IconWallet,
  IconKey,
  IconCheck,
  IconLoader2,
  IconExternalLink,
  IconTrash,
  IconRefresh,
  IconMail,
  IconPhone,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [settings, setSettings] = useState({
    // Profile
    displayName: '',
    email: '',
    photoURL: '',
    
    // GitHub
    githubConnected: false,
    githubUsername: '',
    selectedRepo: '',
    
    // Notifications
    emailNotifications: true,
    whatsappNotifications: false,
    phoneNumber: '',
    dailyNews: true,
    weeklySpyReport: true,
    vcMotivation: false,
    criticalAlertsOnly: false,
    
    // Preferences
    theme: 'dark',
    compactMode: false,
    showTokenUsage: true,
    
    // Blockchain
    walletAddress: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadSettings = async () => {
    try {
      // Load from user profile and database
      setSettings(prev => ({
        ...prev,
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || ''
      }));

      // Fetch additional settings from API
      const res = await fetch(`/api/users/settings?userId=${currentUser.uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveSuccess(false);
    
    try {
      const res = await fetch('/api/users/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          settings
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectGithub = () => {
    window.location.href = '/api/github/authorize';
  };

  const disconnectGithub = async () => {
    try {
      await fetch('/api/github/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid })
      });
      setSettings(prev => ({
        ...prev,
        githubConnected: false,
        githubUsername: '',
        selectedRepo: ''
      }));
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: IconUser },
    { id: 'github', label: 'GitHub', icon: IconBrandGithub },
    { id: 'notifications', label: 'Notifications', icon: IconBell },
    { id: 'blockchain', label: 'Blockchain', icon: IconWallet },
    { id: 'security', label: 'Security', icon: IconKey }
  ];

  const Toggle = ({ value, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        value ? 'bg-ghost-blue' : 'bg-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
        value ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/30">
              <IconSettings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-ghost-blue text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <IconLoader2 className="w-5 h-5 animate-spin" />
            ) : saveSuccess ? (
              <IconCheck className="w-5 h-5" />
            ) : null}
            {saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-ghost-blue/20 text-ghost-blue border border-ghost-blue/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghost-blue to-neon-green flex items-center justify-center text-3xl font-bold text-black">
                    {settings.displayName?.charAt(0) || settings.email?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{settings.displayName || 'User'}</p>
                    <p className="text-gray-400 text-sm">{settings.email}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Display Name</label>
                    <input
                      type="text"
                      value={settings.displayName}
                      onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-ghost-blue/50 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {settings.theme === 'dark' ? (
                      <IconMoon className="w-5 h-5 text-ghost-blue" />
                    ) : (
                      <IconSun className="w-5 h-5 text-ghost-gold" />
                    )}
                    <div>
                      <p className="text-white font-medium">Theme</p>
                      <p className="text-gray-400 text-sm">Currently: Dark Mode</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">Only dark mode available</span>
                </div>
              </div>
            )}

            {/* GitHub Tab */}
            {activeTab === 'github' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">GitHub Integration</h2>
                
                {settings.githubConnected ? (
                  <div className="space-y-4">
                    {/* Connected Status */}
                    <div className="flex items-center justify-between p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconCheck className="w-5 h-5 text-neon-green" />
                        <div>
                          <p className="text-white font-medium">GitHub Connected</p>
                          <p className="text-gray-400 text-sm">@{settings.githubUsername}</p>
                        </div>
                      </div>
                      <button
                        onClick={disconnectGithub}
                        className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <IconTrash className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>

                    {/* Selected Repo */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Selected Repository</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.selectedRepo || 'No repository selected'}
                          disabled
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                        <a
                          href={`https://github.com/${settings.githubUsername}/${settings.selectedRepo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <IconExternalLink className="w-5 h-5 text-gray-400" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={connectGithub}
                      className="w-full py-3 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <IconRefresh className="w-5 h-5" />
                      Change Repository
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <IconBrandGithub className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Connect Your GitHub</h3>
                    <p className="text-gray-400 mb-6">
                      Link your GitHub account to enable automatic code reviews and repository analysis
                    </p>
                    <button
                      onClick={connectGithub}
                      className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                    >
                      <IconBrandGithub className="w-5 h-5" />
                      Connect GitHub
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                
                {/* Contact Info */}
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <IconPhone className="w-4 h-4" />
                      Phone Number (for WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-ghost-blue/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', icon: IconMail, label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'whatsappNotifications', icon: IconPhone, label: 'WhatsApp Notifications', desc: 'Critical alerts via WhatsApp' },
                    { key: 'dailyNews', icon: IconBell, label: 'Daily News Digest', desc: 'News Banshee daily summary' },
                    { key: 'weeklySpyReport', icon: IconBell, label: 'Weekly Spy Reports', desc: 'Shadow Scout competitor analysis' },
                    { key: 'vcMotivation', icon: IconBell, label: 'VC Tough Love', desc: 'Random motivation from Investor Ghoul' },
                    { key: 'criticalAlertsOnly', icon: IconBell, label: 'Critical Alerts Only', desc: 'Only receive critical security alerts' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-ghost-blue" />
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                      <Toggle
                        value={settings[item.key]}
                        onChange={(val) => setSettings(prev => ({ ...prev, [item.key]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blockchain Tab */}
            {activeTab === 'blockchain' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Blockchain Settings</h2>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Wallet Address (Sepolia)</label>
                  <input
                    type="text"
                    value={settings.walletAddress}
                    onChange={(e) => setSettings(prev => ({ ...prev, walletAddress: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-mono focus:border-ghost-blue/50 focus:outline-none"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Used for Equity Phantom transfers. Make sure this is a Sepolia testnet address.
                  </p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Only use testnet wallets. Never connect mainnet wallets to this application.
                  </p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-4">
                  {/* Change Password */}
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Password</p>
                        <p className="text-gray-400 text-sm">Last changed: Never</p>
                      </div>
                      <button className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two Factor */}
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Active Sessions</p>
                        <p className="text-gray-400 text-sm">1 active session</p>
                      </div>
                      <button className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        Sign Out All
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mt-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-400 font-medium">Delete Account</p>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
