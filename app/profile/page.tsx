"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSave = async () => {
    console.log("Saving changes...");
    try {
      const updateData = new FormData()
      updateData.append("first_name", formData.first_name)
      updateData.append("last_name", formData.last_name)
      updateData.append("email", formData.email)
      updateData.append("phone_number", formData.phone_number)

      if (selectedFile) {
        updateData.append("profile_image", selectedFile)
      }

      await apiClient.updateCurrentUser(updateData)
      alert("Profile updated successfully!")
      setEditing(false)
      // Refresh user data from auth context after update
      // This assumes useAuth has a way to refetch user data or user is updated directly
      // For now, a full page reload might be needed or explicit user context update
      window.location.reload(); // Simple reload to reflect changes
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : user.profile_image || "/placeholder.svg"} alt={user.first_name} />
                    <AvatarFallback className="text-lg">
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600 capitalize">{user.user_type.replace("_", " ")}</p>
                  </div>
                </div>

                {editing && (
                  <div>
                    <Label htmlFor="profile_image">Profile Picture</Label>
                    <Input
                      id="profile_image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  {editing ? (
                    <>
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => { setEditing(true); console.log("Edit Profile clicked, editing set to true"); }}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-medium capitalize">{user.user_type.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
