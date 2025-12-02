"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentSidebar } from "@/components/shared/student-sidebar"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Globe, Shield, Mail, Smartphone, CheckCircle } from "lucide-react"

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    testReminders: true,
    resourceUpdates: false,
    darkMode: false,
    language: "english",
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <StudentSidebar>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {saved && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully!
          </div>
        )}

        {/* Notifications */}
        <Card className="p-6 border-0 shadow-lg mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <div className="space-y-4">
            {[
              {
                key: "emailNotifications",
                label: "Email Notifications",
                description: "Receive updates via email",
                icon: Mail,
              },
              {
                key: "pushNotifications",
                label: "Push Notifications",
                description: "Receive push notifications",
                icon: Smartphone,
              },
              {
                key: "assignmentReminders",
                label: "Assignment Reminders",
                description: "Get reminded about pending assignments",
                icon: Bell,
              },
              {
                key: "testReminders",
                label: "Test Reminders",
                description: "Get notified before upcoming tests",
                icon: Bell,
              },
              {
                key: "resourceUpdates",
                label: "Resource Updates",
                description: "Notify when new resources are added",
                icon: Bell,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                  />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 border-0 shadow-lg mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Appearance
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
            />
          </div>
        </Card>

        {/* Language */}
        <Card className="p-6 border-0 shadow-lg mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Language
          </h3>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="marathi">Marathi</option>
          </select>
        </Card>

        {/* Security Notice */}
        <Card className="p-6 border-0 shadow-lg bg-muted/50 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Account Security</h3>
              <p className="text-muted-foreground text-sm mb-4">
                For security reasons, password changes can only be done by the administrator. If you need to change your
                password, please contact the admin.
              </p>
              <Button variant="outline" size="sm">
                Contact Admin
              </Button>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">
          Save Settings
        </Button>
      </div>
    </StudentSidebar>
  )
}
