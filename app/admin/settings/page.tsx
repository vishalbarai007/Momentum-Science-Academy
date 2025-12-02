"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Globe, Bell, Shield, Mail, Save, Upload, Building, Phone, MapPin } from "lucide-react"

export default function AdminSettingsPage() {
  const [successMessage, setSuccessMessage] = useState("")
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Momentum Science Academy",
    tagline: "Excellence in Science Education",
    email: "info@momentumacademy.edu",
    phone: "+91 98765 43210",
    address: "123 Education Lane, Vasai East, Maharashtra 401208",
    logo: "/logo.png",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newLeadAlert: true,
    newRegistration: true,
    resourceUpload: false,
    weeklyReport: true,
    monthlyAnalytics: true,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    ipWhitelist: "",
  })

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleSaveGeneral = () => {
    showSuccess("General settings saved successfully!")
  }

  const handleSaveNotifications = () => {
    showSuccess("Notification preferences updated!")
  }

  const handleSaveSecurity = () => {
    showSuccess("Security settings updated!")
  }

  return (
    <AdminSidebar>
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration and preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">General Information</h3>
                  <p className="text-sm text-muted-foreground">Basic platform details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={generalSettings.tagline}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={generalSettings.email}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={generalSettings.phone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      className="pl-10 min-h-20"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSaveGeneral} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Configure alert settings</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">New Lead Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new lead is submitted</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newLeadAlert}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, newLeadAlert: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">New Registration Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified for new student/teacher registrations</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newRegistration}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, newRegistration: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Resource Upload Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when teachers upload resources</p>
                  </div>
                  <Switch
                    checked={notificationSettings.resourceUpload}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, resourceUpload: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Monthly Analytics</p>
                    <p className="text-sm text-muted-foreground">Receive monthly analytics reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyAnalytics}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, monthlyAnalytics: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure security options</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Select
                      value={securitySettings.passwordExpiry}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist (comma separated)</Label>
                  <Textarea
                    id="ipWhitelist"
                    placeholder="e.g., 192.168.1.1, 10.0.0.1"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to allow all IPs</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSaveSecurity} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Configuration</h3>
                  <p className="text-sm text-muted-foreground">SMTP and email template settings</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="your-email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input id="smtpPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input id="fromName" placeholder="Momentum Science Academy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input id="fromEmail" type="email" placeholder="noreply@momentumacademy.edu" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button variant="outline">Send Test Email</Button>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminSidebar>
  )
}
